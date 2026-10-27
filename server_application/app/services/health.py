import logging
import time

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.schemas.health import DatabaseHealth, HealthResponse

logger = logging.getLogger(__name__)


async def check_database(session: AsyncSession) -> DatabaseHealth:
    """Run a trivial query and time it."""
    started_at = time.perf_counter()
    try:
        await session.execute(text("SELECT 1"))
    except Exception:
        # Details go to the server log, never to the client.
        logger.exception("Database health check failed")
        return DatabaseHealth(engine=settings.database_engine, status="disconnected")
    latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
    return DatabaseHealth(
        engine=settings.database_engine, status="connected", latency_ms=latency_ms
    )


async def get_health(session: AsyncSession) -> HealthResponse:
    database = await check_database(session)
    return HealthResponse(
        status="ok" if database.status == "connected" else "degraded",
        environment=settings.APP_ENV,
        version=settings.VERSION,
        database=database,
    )
