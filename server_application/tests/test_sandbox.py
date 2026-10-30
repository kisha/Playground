import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import create_app

ENDPOINTS = [
    "/api/v1/sandbox/gateway-completion",
    "/api/v1/sandbox/term-enrollment",
    "/api/v1/sandbox/credit-completion",
    "/api/v1/sandbox/persistence-retention",
    "/api/v1/sandbox/completion-by-group",
    "/api/v1/sandbox/persistence-by-age",
    "/api/v1/sandbox/time-to-complete",
    "/api/v1/sandbox/entry-status-share",
    "/api/v1/sandbox/gender-share",
    "/api/v1/sandbox/credit-load",
    "/api/v1/sandbox/headcount",
    "/api/v1/sandbox/add-a-sandbox-page/by-modality",
    "/api/v1/sandbox/add-a-sandbox-page/by-program",
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


def test_persistence_retention_carries_filters_and_definitions(client: TestClient) -> None:
    meta = client.get("/api/v1/sandbox/persistence-retention").json()["meta"]

    assert meta["filters"] == ["Fall entry", "New + Transfer"]
    assert meta["definitions"]["Persistence"] == "Students continuing anywhere"


def test_sandbox_is_not_mounted_when_disabled(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "SANDBOX_ENABLED", False)

    with TestClient(create_app()) as client:
        assert client.get("/api/v1/sandbox/gateway-completion").status_code == 404
        assert client.get("/api/v1/sandbox/add-a-sandbox-page/by-program").status_code == 404
        assert client.get("/api/v1/health").status_code == 200


def test_filtered_completion_changes_with_its_filters(client: TestClient) -> None:
    unfiltered = client.get("/api/v1/sandbox/filtered-completion").json()
    filtered = client.get(
        "/api/v1/sandbox/filtered-completion",
        params={"cohort_year": 2023, "gender": "Female", "course_modality": "Online"},
    ).json()

    assert unfiltered["kpis"] == {"gateway_completion": 68, "english": 74, "math": 62}
    assert filtered["kpis"]["english"] == 70
    assert filtered["applied_filters"] == ["2023", "Female", "Online"]


def test_filtered_completion_rejects_an_unknown_filter_value(client: TestClient) -> None:
    response = client.get("/api/v1/sandbox/filtered-completion", params={"gender": "Unknown"})

    assert response.status_code == 422
