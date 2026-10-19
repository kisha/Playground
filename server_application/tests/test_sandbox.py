import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import create_app

ENDPOINTS = [
    "/api/v1/sandbox/kpis",
    "/api/v1/sandbox/gateway-completion",
    "/api/v1/sandbox/term-enrollment",
    "/api/v1/sandbox/credit-completion",
    "/api/v1/sandbox/persistence-retention",
    "/api/v1/sandbox/completion-by-group",
    "/api/v1/sandbox/persistence-by-age",
    "/api/v1/sandbox/time-to-complete",
]


@pytest.mark.parametrize("path", ENDPOINTS)
def test_sandbox_endpoints_return_labelled_mock_data(client: TestClient, path: str) -> None:
    response = client.get(path)

    assert response.status_code == 200
    body = response.json()
    assert body["meta"]["source"] == "mock"
    assert body["meta"]["title"]
    assert body.get("rows") or body.get("items")


def test_gateway_completion_has_both_series_for_six_terms(client: TestClient) -> None:
    rows = client.get("/api/v1/sandbox/gateway-completion").json()["rows"]

    assert len(rows) == 6
    assert all({"term", "english", "math"} <= row.keys() for row in rows)


def test_kpis_include_percent_and_split_measures(client: TestClient) -> None:
    items = {item["id"]: item for item in client.get("/api/v1/sandbox/kpis").json()["items"]}

    assert items["first_year_credit_completion"] == {
        "id": "first_year_credit_completion",
        "label": "First-year credit completion",
        "unit": "percent",
        "value": 76.0,
        "secondary_value": None,
        "detail": "fall 2025 cohort",
    }
    assert (items["female_male"]["value"], items["female_male"]["secondary_value"]) == (64, 36)


def test_persistence_retention_carries_filters_and_definitions(client: TestClient) -> None:
    meta = client.get("/api/v1/sandbox/persistence-retention").json()["meta"]

    assert meta["filters"] == ["Fall entry", "New + Transfer"]
    assert meta["definitions"]["Persistence"] == "Students continuing anywhere"


def test_sandbox_is_not_mounted_when_disabled(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "SANDBOX_ENABLED", False)

    with TestClient(create_app()) as client:
        assert client.get("/api/v1/sandbox/kpis").status_code == 404
        assert client.get("/api/v1/health").status_code == 200
