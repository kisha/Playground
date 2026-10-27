from fastapi.testclient import TestClient

from app.core.config import settings
from app.db.session import get_session
from app.main import app


def test_health_reports_connected_database(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["environment"] == "development"
    assert body["database"]["status"] == "connected"
    assert body["database"]["engine"] == settings.database_engine


class _BrokenSession:
    async def execute(self, *_args, **_kwargs):
        raise ConnectionError("database unreachable")


async def _broken_session():
    yield _BrokenSession()


def test_health_returns_503_without_leaking_errors(client: TestClient) -> None:
    app.dependency_overrides[get_session] = _broken_session
    try:
        response = client.get("/api/v1/health")
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    body = response.json()
    assert body["status"] == "degraded"
    assert body["database"] == {
        "engine": settings.database_engine,
        "status": "disconnected",
        "latency_ms": None,
    }
    assert "unreachable" not in response.text
