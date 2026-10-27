"""create documents table

Revision ID: 06b55be34643
Revises: cdff69764e92
Create Date: 2026-10-18 23:49:42.988419

"""

from collections.abc import Sequence

import pgvector.sqlalchemy
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "06b55be34643"
down_revision: str | Sequence[str] | None = "cdff69764e92"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema. The vector column type, UUIDv7 default and HNSW index are PostgreSQL only."""
    is_postgresql = op.get_bind().dialect.name == "postgresql"
    op.create_table(
        "documents",
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column(
            "embedding",
            pgvector.sqlalchemy.vector.VECTOR(dim=256) if is_postgresql else sa.JSON(),
            nullable=False,
        ),
        sa.Column(
            "id",
            sa.Uuid(),
            server_default=sa.text("uuidv7()") if is_postgresql else None,
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_documents")),
    )
    if is_postgresql:
        op.create_index(
            "ix_documents_embedding_hnsw",
            "documents",
            ["embedding"],
            unique=False,
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "vector_cosine_ops"},
        )


def downgrade() -> None:
    """Downgrade schema."""
    if op.get_bind().dialect.name == "postgresql":
        op.drop_index(
            "ix_documents_embedding_hnsw",
            table_name="documents",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "vector_cosine_ops"},
        )
    op.drop_table("documents")
