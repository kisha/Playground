"""Every model is imported here so Alembic autogenerate can see the full schema."""

from app.db.base import Base
from app.models.document import Document

__all__ = ["Base", "Document"]
