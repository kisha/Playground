"""Fixture-backed results for the Sandbox Measures route.

The public response deliberately mirrors the results shape proposed for the Measures
work. `load_results` is the seam where a later implementation can call `run_measure`
against the normalized PDP data model instead of returning a fixture.
"""

from dataclasses import dataclass

from app.sandbox.shared import ChartMeta

from .schemas import Cohort, GroupBy, GroupRateResponse, GroupRateRow, Measure


@dataclass(frozen=True)
class MeasureResult:
    """One PDP-style result before it is made safe to display in a chart."""

    measure: Measure
    cohort: Cohort
    group_dimensions: tuple[GroupBy, ...]
    group_values: tuple[str, ...]
    numerator: int | None
    denominator: int | None
    metric_rate: float | None
    suppressed: bool
    n_excluded: int = 0
    exclusion_reason: str | None = None


# These values are a small, synthetic fixture. The gateway-math by-gender values
# match the documented query example in normalized-data-model/README.md; the final
# category demonstrates how a group with n < 10 becomes safe for display.
_FIXTURE_RESULTS: tuple[MeasureResult, ...] = (
    MeasureResult("gateway_math", "2022-23", ("gender",), ("F",), 162, 620, 0.261, False),
    MeasureResult("gateway_math", "2022-23", ("gender",), ("M",), 116, 456, 0.254, False),
    MeasureResult("gateway_math", "2022-23", ("gender",), ("Unknown",), 25, 72, 0.347, False),
    MeasureResult(
        "gateway_math",
        "2022-23",
        ("gender",),
        ("X",),
        1,
        1,
        1.0,
        True,
        exclusion_reason="Suppressed because the denominator is fewer than 10 students.",
    ),
)

_MEASURE_LABELS = {
    "retention": "Retention",
    "persistence": "Persistence",
    "gateway_math": "Gateway math completion",
    "gateway_english": "Gateway English completion",
}

_GROUP_LABELS = {
    "race": "Race and ethnicity",
    "gender": "Gender",
    "pell": "Pell eligibility",
    "age_band": "Age band",
    "enrollment_intensity": "Enrollment intensity",
}


def load_results() -> tuple[MeasureResult, ...]:
    """Load the current fixture; replace this with a future `run_measure` call."""
    return _FIXTURE_RESULTS


def get_by_group(measure: Measure, cohort: Cohort, group_by: GroupBy) -> GroupRateResponse:
    """Return display-safe rates for exactly one measure, cohort, and grouping."""
    results = [
        result
        for result in load_results()
        if result.measure == measure
        and result.cohort == cohort
        and group_by in result.group_dimensions
    ]
    return GroupRateResponse(
        meta=ChartMeta(
            title=f"{_MEASURE_LABELS[measure]} by {_GROUP_LABELS[group_by].lower()}",
            description="A PDP-shaped fixture for one measure, cohort, and student grouping.",
            takeaway=(
                "The example includes one suppressed category so the chart demonstrates "
                "how an implementation should avoid displaying small-group results."
            ),
            fields_used=["Measure result", "Cohort", "Student group", "Numerator", "Denominator"],
            filters=[
                f"Measure: {_MEASURE_LABELS[measure]}",
                f"Cohort: {cohort}",
                f"Group by: {_GROUP_LABELS[group_by]}",
            ],
            definitions={
                "Rate": (
                    "Numerator divided by denominator, shown only when the group is not suppressed."
                ),
                "n": "The denominator used for the displayed rate.",
            },
            source="synthetic",
        ),
        rows=[
            GroupRateRow(
                group=result.group_values[0],
                rate=None if result.suppressed else round((result.metric_rate or 0) * 100, 1),
                n=None if result.suppressed else result.denominator,
            )
            for result in results
        ],
    )
