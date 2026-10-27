from sqlalchemy import Index, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.db.types import Embedding
from app.services.embeddings import EMBEDDING_DIMENSIONS


class Document(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "documents"

    content: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float]] = mapped_column(Embedding(EMBEDDING_DIMENSIONS))

    __table_args__ = (
        # HNSW index for fast approximate nearest-neighbour search by cosine distance.
        # PostgreSQL only; the migration skips it on SQLite.
        Index(
            "ix_documents_embedding_hnsw",
            "embedding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "vector_cosine_ops"},
        ),
    )
