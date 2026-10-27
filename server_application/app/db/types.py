"""Column types that work on PostgreSQL (the default) and on SQLite."""

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON
from sqlalchemy.engine import Dialect
from sqlalchemy.types import TypeDecorator, TypeEngine


class Embedding(TypeDecorator[list[float]]):
    """A vector of floats: pgvector's `vector` on PostgreSQL, JSON on SQLite."""

    impl = JSON
    cache_ok = True
    # cosine_distance() and the other pgvector operators. Only used on PostgreSQL.
    comparator_factory = Vector.comparator_factory

    def __init__(self, dimensions: int) -> None:
        super().__init__()
        self.dimensions = dimensions

    def load_dialect_impl(self, dialect: Dialect) -> TypeEngine:
        if dialect.name == "postgresql":
            return dialect.type_descriptor(Vector(self.dimensions))
        return dialect.type_descriptor(JSON())
