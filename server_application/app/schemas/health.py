from typing import Literal

from pydantic import BaseModel

from app.core.config import Environment


class DatabaseHealth(BaseModel):
    status: Literal["connected", "disconnected"]
    latency_ms: float | None = None


class HealthResponse(BaseModel):
    status: Literal["ok", "degraded"]
    environment: Environment
    version: str
    database: DatabaseHealth
