import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

# Requires at least one letter or digit, so there is always something to embed.
_HAS_WORD = r"\w"


class DocumentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=10_000, pattern=_HAS_WORD)


class DocumentRead(BaseModel):
    """A stored document. The embedding stays server-side; clients never need the raw vector."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    content: str
    created_at: datetime
    updated_at: datetime


class DocumentList(BaseModel):
    items: list[DocumentRead]
    total: int


class DocumentSearch(BaseModel):
    query: str = Field(min_length=1, max_length=1_000, pattern=_HAS_WORD)
    limit: int = Field(default=5, ge=1, le=50)


class DocumentMatch(BaseModel):
    document: DocumentRead
    similarity: float = Field(description="Cosine similarity: 1 is identical, 0 is unrelated.")


class DocumentSearchResults(BaseModel):
    query: str
    matches: list[DocumentMatch]
