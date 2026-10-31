"""Mock data for the KPI cards, shaped like PDP Analysis-Ready (AR) file outputs.

The numbers are invented and contain no real institution or student data.
"""

from collections.abc import Callable

from app.sandbox.shared import ChartMeta, Kpi, KpiResponse

from .schemas import ChartName

COHORT_FILTERS = ["Fall entry", "New + Transfer"]
DEFINITIONS = {
    "Persistence": "Students continuing anywhere",
    "Retention": "Students staying at the institution",
}


def get_student_progress() -> KpiResponse:
    return KpiResponse(
        meta=ChartMeta(
            title="Student progress",
            description="Headline percentages for the fall 2025 cohort.",
            fields_used=["Cohort", "Credits earned", "Gateway course"],
            filters=COHORT_FILTERS,
            definitions=DEFINITIONS,
        ),
        items=[
            Kpi(
                id="first_year_credit_completion",
                label="First-year credit completion",
                unit="percent",
                value=76,
                detail="fall 2025 cohort",
            ),
            Kpi(
                id="gateway_completion",
                label="Gateway course completion",
                unit="percent",
                value=68,
                detail="math and English",
            ),
            Kpi(
                id="persistence",
                label="Persistence rate",
                unit="percent",
                value=84,
                detail="continuing anywhere",
            ),
            Kpi(
                id="retention",
                label="Retention rate",
                unit="percent",
                value=72,
                detail="staying at the institution",
            ),
        ],
    )


def get_student_mix() -> KpiResponse:
    return KpiResponse(
        meta=ChartMeta(
            title="Student mix",
            description="Splits like Female / Male, shown as two numbers on one card.",
            fields_used=["Cohort", "Gender", "First gen"],
            filters=COHORT_FILTERS,
        ),
        items=[
            Kpi(
                id="female_male",
                label="Female / Male",
                unit="split",
                value=64,
                secondary_value=36,
                detail="% of students",
            ),
            Kpi(
                id="new_transfer",
                label="New / Transfer",
                unit="split",
                value=71,
                secondary_value=29,
                detail="% of students",
            ),
            Kpi(
                id="first_gen",
                label="First-gen students",
                unit="percent",
                value=62,
                detail="of new students",
            ),
        ],
    )


def get_time_to_complete() -> KpiResponse:
    return KpiResponse(
        meta=ChartMeta(
            title="Time to complete",
            description="Average terms from first enrollment to completion.",
            fields_used=["Entry term (campus)", "Completion (PDP)"],
        ),
        items=[
            Kpi(
                id="time_to_complete",
                label="Time to complete",
                unit="terms",
                value=5.5,
                detail="average, all entry terms",
            ),
            Kpi(
                id="fall_start",
                label="Fall start",
                unit="terms",
                value=5.1,
                detail="average",
            ),
            Kpi(
                id="spring_start",
                label="Spring start",
                unit="terms",
                value=5.8,
                detail="average",
            ),
            Kpi(
                id="summer_start",
                label="Summer start",
                unit="terms",
                value=6.3,
                detail="average",
            ),
        ],
    )


CHART_LOADERS: dict[ChartName, Callable[[], KpiResponse]] = {
    ChartName.STUDENT_PROGRESS: get_student_progress,
    ChartName.STUDENT_MIX: get_student_mix,
    ChartName.TIME_TO_COMPLETE: get_time_to_complete,
}
