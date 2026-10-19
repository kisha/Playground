from fastapi import APIRouter, Response, status

from app.api.dependencies import SessionDep
from app.schemas.health import HealthResponse
from app.services.health import get_health

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": HealthResponse}},
)
async def health(
    response: Response,
    session: SessionDep,
) -> HealthResponse:
    """Report the environment and whether the API can reach the database."""
    result = await get_health(session)
    if result.status != "ok":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return result
