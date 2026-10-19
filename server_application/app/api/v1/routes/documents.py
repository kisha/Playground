import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.models.document import Document
from app.schemas.document import (
    DocumentCreate,
    DocumentList,
    DocumentRead,
    DocumentSearch,
    DocumentSearchResults,
)
from app.services import documents as service
from app.services.embeddings import Embedder, get_embedder

router = APIRouter(prefix="/documents", tags=["documents"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]
EmbedderDep = Annotated[Embedder, Depends(get_embedder)]


async def _get_or_404(session: SessionDep, document_id: uuid.UUID) -> Document:
    document = await service.get_document(session, document_id)
    if document is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return document


DocumentDep = Annotated[Document, Depends(_get_or_404)]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_document(
    payload: DocumentCreate, session: SessionDep, embedder: EmbedderDep
) -> DocumentRead:
    """Store text along with its vector embedding."""
    document = await service.create_document(session, embedder, payload.content)
    return DocumentRead.model_validate(document)


@router.get("")
async def list_documents(
    session: SessionDep,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> DocumentList:
    """List documents, newest first."""
    items, total = await service.list_documents(session, limit, offset)
    return DocumentList(items=[DocumentRead.model_validate(d) for d in items], total=total)


@router.post("/search")
async def search_documents(
    payload: DocumentSearch, session: SessionDep, embedder: EmbedderDep
) -> DocumentSearchResults:
    """Find the documents most similar to the query using pgvector cosine distance."""
    matches = await service.search_documents(session, embedder, payload.query, payload.limit)
    return DocumentSearchResults(query=payload.query, matches=matches)


@router.get("/{document_id}", responses={404: {"description": "Document not found"}})
async def get_document(document: DocumentDep) -> DocumentRead:
    return DocumentRead.model_validate(document)


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"description": "Document not found"}},
)
async def delete_document(document: DocumentDep, session: SessionDep) -> None:
    await service.delete_document(session, document)
