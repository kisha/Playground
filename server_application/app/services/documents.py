import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document
from app.schemas.document import DocumentMatch, DocumentRead
from app.services.embeddings import Embedder


async def create_document(session: AsyncSession, embedder: Embedder, content: str) -> Document:
    document = Document(content=content, embedding=embedder.embed(content))
    session.add(document)
    await session.commit()
    await session.refresh(document)
    return document


async def list_documents(
    session: AsyncSession, limit: int, offset: int
) -> tuple[list[Document], int]:
    total = await session.scalar(select(func.count()).select_from(Document))
    rows = await session.scalars(
        select(Document).order_by(Document.created_at.desc()).limit(limit).offset(offset)
    )
    return list(rows), total or 0


async def get_document(session: AsyncSession, document_id: uuid.UUID) -> Document | None:
    return await session.get(Document, document_id)


async def delete_document(session: AsyncSession, document: Document) -> None:
    await session.delete(document)
    await session.commit()


async def search_documents(
    session: AsyncSession, embedder: Embedder, query: str, limit: int
) -> list[DocumentMatch]:
    """Nearest documents by cosine distance, served by the HNSW index."""
    distance = Document.embedding.cosine_distance(embedder.embed(query)).label("distance")
    rows = await session.execute(select(Document, distance).order_by(distance).limit(limit))
    return [
        DocumentMatch(
            document=DocumentRead.model_validate(document),
            similarity=round(1 - distance_value, 4),
        )
        for document, distance_value in rows
    ]
