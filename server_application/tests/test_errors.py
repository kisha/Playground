from fastapi.testclient import TestClient

from app.main import app


def test_unknown_endpoint_returns_json_error_with_docs_hint(client: TestClient) -> None:
    response = client.get("/api/v1/does-not-exist")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "status": 404,
            "code": "not_found",
            "message": "No endpoint matches GET /api/v1/does-not-exist.",
            "path": "/api/v1/does-not-exist",
            "docs": "/docs",
        }
    }


def test_missing_resource_keeps_its_own_message(client: TestClient) -> None:
    response = client.get("/api/v1/documents/01a152ec-e1a9-72a0-8679-f33b5bc941e3")

    assert response.status_code == 404
    assert response.json()["error"]["message"] == "Document not found"
    assert "docs" not in response.json()["error"]


def test_validation_errors_list_each_field(client: TestClient) -> None:
    response = client.post("/api/v1/documents", json={"content": ""})

    error = response.json()["error"]
    assert response.status_code == 422
    assert error["code"] == "validation_error"
    assert error["details"][0]["loc"] == ["body", "content"]


def test_wrong_method_returns_405(client: TestClient) -> None:
    response = client.delete("/api/v1/health")

    assert response.status_code == 405
    assert response.json()["error"]["code"] == "method_not_allowed"


def test_unexpected_errors_hide_details() -> None:
    @app.get("/api/v1/_boom", include_in_schema=False)
    async def boom() -> None:
        raise RuntimeError("secret internal detail")

    try:
        with TestClient(app, raise_server_exceptions=False) as client:
            response = client.get("/api/v1/_boom")
    finally:
        app.router.routes = [
            route for route in app.router.routes if getattr(route, "path", "") != "/api/v1/_boom"
        ]

    assert response.status_code == 500
    assert response.json()["error"]["code"] == "internal_error"
    assert "secret" not in response.text
