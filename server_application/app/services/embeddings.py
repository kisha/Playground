"""Text → vector conversion.

The default HashingEmbedder needs no model download or API key, so vector search works out of
the box. It captures shared words, not meaning. For semantic search, implement `Embedder` with a
real model (sentence-transformers, OpenAI, Voyage, ...) and return it from `get_embedder`.
If the new model's dimension differs from EMBEDDING_DIMENSIONS, add a migration for the column.
"""

import hashlib
import math
import re
from functools import lru_cache
from typing import Protocol

EMBEDDING_DIMENSIONS = 256

_TOKEN = re.compile(r"\w+")


class Embedder(Protocol):
    dimensions: int

    def embed(self, text: str) -> list[float]: ...


class HashingEmbedder:
    """Feature hashing: each word lands in a fixed bucket, giving a unit-length vector."""

    def __init__(self, dimensions: int = EMBEDDING_DIMENSIONS) -> None:
        self.dimensions = dimensions

    def embed(self, text: str) -> list[float]:
        vector = [0.0] * self.dimensions
        for token in _TOKEN.findall(text.lower()):
            digest = hashlib.blake2b(token.encode(), digest_size=8).digest()
            bucket = int.from_bytes(digest[:4], "big") % self.dimensions
            sign = 1.0 if digest[4] & 1 else -1.0
            vector[bucket] += sign

        norm = math.sqrt(sum(value * value for value in vector))
        if norm == 0:
            raise ValueError("Text must contain at least one word to embed.")
        return [value / norm for value in vector]


@lru_cache
def get_embedder() -> Embedder:
    return HashingEmbedder()
