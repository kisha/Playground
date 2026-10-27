import math
import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
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
        select(Document)
        # created_at can tie (SQLite counts whole seconds); UUIDv7 ids are time-ordered too.
        .order_by(Document.created_at.desc(), Document.id.desc())
        .limit(limit)
        .offset(offset)
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
    """Nearest documents by cosine distance: pgvector on PostgreSQL, plain Python on SQLite."""
    query_embedding = embedder.embed(query)
    if settings.database_engine == "sqlite":
        ranked = await _rank_in_python(session, query_embedding, limit)
    else:
        distance = Document.embedding.cosine_distance(query_embedding).label("distance")
        rows = await session.execute(select(Document, distance).order_by(distance).limit(limit))
        ranked = [(document, distance_value) for document, distance_value in rows]
    return [
        DocumentMatch(
            document=DocumentRead.model_validate(document),
            similarity=round(1 - distance_value, 4),
        )
        for document, distance_value in ranked
    ]


async def _rank_in_python(
    session: AsyncSession, query_embedding: list[float], limit: int
) -> list[tuple[Document, float]]:
    """SQLite has no pgvector, so compare the query with every document here, in Python.

    Gives the same results as pgvector, without an index: fine for a small instance. If an SQLite
    instance needs faster search, the sqlite-vec extension can move this work into SQLite.
    """
    documents = await session.scalars(select(Document))
    distances = [
        (document, _cosine_distance(document.embedding, query_embedding)) for document in documents
    ]
    return sorted(distances, key=lambda document_and_distance: document_and_distance[1])[:limit]


def _cosine_distance(embedding: list[float], other_embedding: list[float]) -> float:
    """1 minus cosine similarity, the same measure as pgvector's <=> operator."""
    lengths = math.hypot(*embedding) * math.hypot(*other_embedding)
    if lengths == 0:
        return 1.0
    dot_product = sum(
        value * other_value for value, other_value in zip(embedding, other_embedding, strict=True)
    )
    return 1 - dot_product / lengths
