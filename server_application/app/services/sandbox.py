"""Mock data for the sandbox, shaped like PDP Analysis-Ready (AR) file outputs.

Labels, filters and definitions follow the PDP measures used in the project briefs. The numbers are
invented and contain no real institution or student data. Replace these functions with real
queries when an instance has AR data of its own.
"""

from app.schemas.sandbox import (
    ChartMeta,
    CompletionByGroupResponse,
    CreditCompletionResponse,
    CreditCompletionRow,
    GatewayCompletionResponse,
    GatewayCompletionRow,
    GroupRateRow,
    Kpi,
    KpiResponse,
    PersistenceByAgeResponse,
    PersistenceByAgeRow,
    PersistenceRetentionResponse,
    PersistenceRetentionRow,
    TermEnrollmentResponse,
    TermEnrollmentRow,
    TimeToCompleteResponse,
    TimeToCompleteRow,
)

TERMS = ["Fall 23", "Spr 24", "Fall 24", "Spr 25", "Fall 25", "Spr 26"]
COHORT_YEARS = [2020, 2021, 2022, 2023, 2024, 2025]
COHORT_FILTERS = ["Fall entry", "New + Transfer"]
DEFINITIONS = {
    "Persistence": "Students continuing anywhere",
    "Retention": "Students staying at the institution",
}


def get_kpis() -> KpiResponse:
    return KpiResponse(
        meta=ChartMeta(
            title="Student progress",
            description="Headline measures for the fall 2025 cohort.",
            fields_used=["Cohort", "Credits earned", "Gateway course", "Gender", "First gen"],
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
            Kpi(
                id="time_to_complete",
                label="Time to complete",
                unit="terms",
                value=5.5,
                detail="average, all entry terms",
            ),
        ],
    )


def get_gateway_completion() -> GatewayCompletionResponse:
    english = [74, 76, 75, 78, 77, 79]
    math = [58, 61, 57, 62, 59, 60]
    return GatewayCompletionResponse(
        meta=ChartMeta(
            title="Gateway course completion, term by term",
            description="Share of students completing gateway English and math, last six terms.",
            takeaway="Gateway math completion trails English by 15 to 19 points every term.",
            fields_used=["Gateway course", "Course completion"],
        ),
        rows=[
            GatewayCompletionRow(term=term, english=e, math=m)
            for term, e, m in zip(TERMS, english, math, strict=True)
        ],
    )


def get_term_enrollment() -> TermEnrollmentResponse:
    enrolled = [66, 79, 63, 80, 62, 81]
    return TermEnrollmentResponse(
        meta=ChartMeta(
            title="Students who stayed enrolled, term to term",
            description="Share of last term's students enrolled again. Fall terms marked.",
            takeaway="Fewer students stay enrolled into fall than into spring, by 13 to 19 points.",
            fields_used=["Cohort term", "Next-term enrollment"],
        ),
        rows=[
            TermEnrollmentRow(
                term=term, enrolled_next_term=value, into_fall=term.startswith("Fall")
            )
            for term, value in zip(TERMS, enrolled, strict=True)
        ],
    )


def get_credit_completion() -> CreditCompletionResponse:
    new = [71, 72, 71, 73, 74, 75]
    transfer = [63, 65, 66, 65, 67, 68]
    return CreditCompletionResponse(
        meta=ChartMeta(
            title="First-year credit completion rate",
            description="Fall cohorts 2020 to 2025, new and transfer students.",
            takeaway="Both groups are improving; transfer students trail new students by 7 points.",
            fields_used=["Cohort", "Enrollment type", "Credits attempted", "Credits earned"],
            filters=COHORT_FILTERS,
        ),
        rows=[
            CreditCompletionRow(cohort_year=year, new=n, transfer=t)
            for year, n, t in zip(COHORT_YEARS, new, transfer, strict=True)
        ],
    )


def get_persistence_retention() -> PersistenceRetentionResponse:
    persistence = [80, 81, 83, 82, 84, 84]
    retention = [65, 67, 68, 67, 70, 72]
    return PersistenceRetentionResponse(
        meta=ChartMeta(
            title="Persistence and retention, fall cohorts",
            description="Fall cohorts 2020 to 2025.",
            takeaway="The gap is students who continued elsewhere.",
            fields_used=["Cohort", "Persistence", "Retention"],
            filters=COHORT_FILTERS,
            definitions=DEFINITIONS,
        ),
        rows=[
            PersistenceRetentionRow(cohort_year=year, persistence=p, retention=r)
            for year, p, r in zip(COHORT_YEARS, persistence, retention, strict=True)
        ],
    )


def get_completion_by_group() -> CompletionByGroupResponse:
    rows = [
        ("Female", 78),
        ("Male", 72),
        ("First-gen", 70),
        ("Online courses", 66),
        ("On-campus courses", 80),
    ]
    return CompletionByGroupResponse(
        meta=ChartMeta(
            title="First-year credit completion by student group",
            description="Fall 2025 cohort.",
            takeaway="Online-course students complete 14 points less often than on-campus.",
            fields_used=["Gender", "First gen", "Course modality", "Credits earned"],
            filters=COHORT_FILTERS,
        ),
        rows=[GroupRateRow(group=group, rate=rate) for group, rate in rows],
    )


def get_persistence_by_age() -> PersistenceByAgeResponse:
    rows = [("Ages 18 to 24", 78, 74), ("Ages 25 to 34", 71, 66), ("Ages 35 and over", 64, 58)]
    return PersistenceByAgeResponse(
        meta=ChartMeta(
            title="Persistence and gateway course completion by age group",
            description="Both rates fall with each older age group.",
            takeaway="Students 35 and over persist 14 points less often than students 18 to 24.",
            fields_used=["Gateway, persistence (PDP)", "Age (campus)"],
        ),
        rows=[
            PersistenceByAgeRow(age_group=age, persistence=p, gateway_completion=g)
            for age, p, g in rows
        ],
    )


def get_time_to_complete() -> TimeToCompleteResponse:
    rows = [("Fall start", 5.1), ("Spring start", 5.8), ("Summer start", 6.3)]
    return TimeToCompleteResponse(
        meta=ChartMeta(
            title="Time to complete by entry term",
            description="Average terms from first enrollment to completion.",
            takeaway="Students who start in summer take over a term longer than fall starters.",
            fields_used=["Entry term (campus)", "Completion (PDP)"],
        ),
        rows=[TimeToCompleteRow(entry_term=term, average_terms=terms) for term, terms in rows],
    )
