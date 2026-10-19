import logging
import time

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.schemas.health import DatabaseHealth, HealthResponse

logger = logging.getLogger(__name__)


async def check_database(session: AsyncSession) -> DatabaseHealth:
    started = time.perf_counter()
    try:
        await session.execute(text("SELECT 1"))
    except Exception:
        # Details go to the server log, never to the client.
        logger.exception("Database health check failed")
        return DatabaseHealth(status="disconnected")
    latency_ms = round((time.perf_counter() - started) * 1000, 2)
    return DatabaseHealth(status="connected", latency_ms=latency_ms)


async def get_health(session: AsyncSession) -> HealthResponse:
    database = await check_database(session)
    return HealthResponse(
        status="ok" if database.status == "connected" else "degraded",
        environment=settings.APP_ENV,
        version=settings.VERSION,
        database=database,
    )
