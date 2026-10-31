import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import create_app
from app.sandbox.chart_examples.schemas import ChartName

CHART_EXAMPLES = "/api/v1/sandbox/chart-examples"
FILTER_EXAMPLE = "/api/v1/sandbox/filter-example"
EXAMPLE_ONE = {"example": "example-one"}
ADD_A_SANDBOX_PAGE = "/api/v1/sandbox/add-a-sandbox-page"


def test_worked_example_answers_with_labelled_charts_by_name(client: TestClient) -> None:
    everything = client.get(ADD_A_SANDBOX_PAGE).json()
    one = client.get(ADD_A_SANDBOX_PAGE, params={"charts": "by-program"}).json()

    assert everything.keys() == {"by-modality", "by-program"}
    assert one.keys() == {"by-program"}
    for chart in everything.values():
        assert chart["meta"]["source"] == "mock"
        assert chart["meta"]["title"]
        assert chart["rows"]


def test_chart_examples_answers_with_every_labelled_chart_by_default(client: TestClient) -> None:
    response = client.get(CHART_EXAMPLES)

    assert response.status_code == 200
    charts = response.json()
    assert charts.keys() == {chart_name.value for chart_name in ChartName}
    for chart in charts.values():
        assert chart["meta"]["source"] == "mock"
        assert chart["meta"]["title"]
        assert chart["rows"]


def test_chart_examples_answers_with_only_the_charts_named(client: TestClient) -> None:
    one = client.get(CHART_EXAMPLES, params={"charts": "entry-status-share"}).json()
    several = client.get(CHART_EXAMPLES, params={"charts": ["gender-share", "headcount"]}).json()

    assert one.keys() == {"entry-status-share"}
    assert {"status", "share"} == one["entry-status-share"]["rows"][0].keys()
    assert several.keys() == {"gender-share", "headcount"}


def test_chart_examples_rejects_an_unknown_chart(client: TestClient) -> None:
    response = client.get(CHART_EXAMPLES, params={"charts": "not-a-chart"})

    assert response.status_code == 422


def test_gateway_completion_has_both_series_for_six_terms(client: TestClient) -> None:
    rows = client.get(CHART_EXAMPLES, params={"charts": "gateway-completion"}).json()[
        "gateway-completion"
    ]["rows"]

    assert len(rows) == 6
    assert all({"term", "english", "math"} <= row.keys() for row in rows)


def test_persistence_retention_carries_filters_and_definitions(client: TestClient) -> None:
    meta = client.get(CHART_EXAMPLES, params={"charts": "persistence-retention"}).json()[
        "persistence-retention"
    ]["meta"]

    assert meta["filters"] == ["Fall entry", "New + Transfer"]
    assert meta["definitions"]["Persistence"] == "Students continuing anywhere"


def test_sandbox_is_not_mounted_when_disabled(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "SANDBOX_ENABLED", False)

    with TestClient(create_app()) as client:
        assert client.get(CHART_EXAMPLES).status_code == 404
        assert client.get(ADD_A_SANDBOX_PAGE).status_code == 404
        assert client.get("/api/v1/health").status_code == 200


def test_filtered_completion_changes_with_its_filters(client: TestClient) -> None:
    unfiltered = client.get(FILTER_EXAMPLE, params=EXAMPLE_ONE).json()
    filtered = client.get(
        FILTER_EXAMPLE,
        params={
            **EXAMPLE_ONE,
            "cohort_year": 2023,
            "gender": "Female",
            "course_modality": "Online",
        },
    ).json()

    assert unfiltered["kpis"] == {"gateway_completion": 68, "english": 74, "math": 62}
    assert filtered["kpis"]["english"] == 70
    assert filtered["applied_filters"] == ["2023", "Female", "Online"]


def test_filtered_completion_rejects_an_unknown_filter_value(client: TestClient) -> None:
    response = client.get(FILTER_EXAMPLE, params={**EXAMPLE_ONE, "gender": "Unknown"})

    assert response.status_code == 422


def test_filter_example_needs_a_known_example(client: TestClient) -> None:
    assert client.get(FILTER_EXAMPLE).status_code == 422
    assert client.get(FILTER_EXAMPLE, params={"example": "not-an-example"}).status_code == 422


def test_measures_by_group_returns_exact_fixture_rates_and_counts(client: TestClient) -> None:
    body = client.get(
        "/api/v1/sandbox/measures/by-group?measure=gateway_math&cohort=2022-23&group_by=gender"
    ).json()

    assert body["meta"]["source"] == "synthetic"
    assert body["meta"]["filters"] == [
        "Measure: Gateway math completion",
        "Cohort: 2022-23",
        "Group by: Gender",
    ]
    assert body["rows"] == [
        {"group": "F", "rate": 26.1, "n": 620},
        {"group": "M", "rate": 25.4, "n": 456},
        {"group": "Unknown", "rate": 34.7, "n": 72},
        {"group": "X", "rate": None, "n": None},
    ]


def test_measures_by_group_rejects_unknown_cohort(client: TestClient) -> None:
    response = client.get("/api/v1/sandbox/measures/by-group?cohort=2020-21")

    assert response.status_code == 422
