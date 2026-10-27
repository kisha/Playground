"""Mock data for the sandbox, shaped like PDP Analysis-Ready (AR) file outputs.

Labels, filters and definitions follow the PDP measures used in the project briefs. The numbers are
invented and contain no real institution or student data. Replace these functions with real
queries when an instance has AR data of its own.
"""

from app.sandbox.shared import COHORT_YEARS, TERMS, ChartMeta, Kpi, KpiResponse

from .schemas import (
    CompletionByGroupResponse,
    CompletionByGroupRow,
    CreditCompletionResponse,
    CreditCompletionRow,
    GatewayCompletionResponse,
    GatewayCompletionRow,
    PersistenceByAgeResponse,
    PersistenceByAgeRow,
    PersistenceRetentionResponse,
    PersistenceRetentionRow,
    TermEnrollmentResponse,
    TermEnrollmentRow,
    TimeToCompleteResponse,
    TimeToCompleteRow,
)

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
    english_rates = [74, 76, 75, 78, 77, 79]
    math_rates = [58, 61, 57, 62, 59, 60]
    return GatewayCompletionResponse(
        meta=ChartMeta(
            title="Gateway course completion, term by term",
            description="Share of students completing gateway English and math, last six terms.",
            takeaway="Gateway math completion trails English by 15 to 19 points every term.",
            fields_used=["Gateway course", "Course completion"],
        ),
        rows=[
            GatewayCompletionRow(term=term, english=english_rate, math=math_rate)
            for term, english_rate, math_rate in zip(TERMS, english_rates, math_rates, strict=True)
        ],
    )


def get_term_enrollment() -> TermEnrollmentResponse:
    enrolled_rates = [66, 79, 63, 80, 62, 81]
    return TermEnrollmentResponse(
        meta=ChartMeta(
            title="Students who stayed enrolled, term to term",
            description="Share of last term's students enrolled again. Fall terms marked.",
            takeaway="Fewer students stay enrolled into fall than into spring, by 13 to 19 points.",
            fields_used=["Cohort term", "Next-term enrollment"],
        ),
        rows=[
            TermEnrollmentRow(
                term=term, enrolled_next_term=enrolled_rate, into_fall=term.startswith("Fall")
            )
            for term, enrolled_rate in zip(TERMS, enrolled_rates, strict=True)
        ],
    )


def get_credit_completion() -> CreditCompletionResponse:
    new_student_rates = [71, 72, 71, 73, 74, 75]
    transfer_student_rates = [63, 65, 66, 65, 67, 68]
    return CreditCompletionResponse(
        meta=ChartMeta(
            title="First-year credit completion rate",
            description="Fall cohorts 2020 to 2025, new and transfer students.",
            takeaway="Both groups are improving; transfer students trail new students by 7 points.",
            fields_used=["Cohort", "Enrollment type", "Credits attempted", "Credits earned"],
            filters=COHORT_FILTERS,
        ),
        rows=[
            CreditCompletionRow(cohort_year=year, new=new_rate, transfer=transfer_rate)
            for year, new_rate, transfer_rate in zip(
                COHORT_YEARS, new_student_rates, transfer_student_rates, strict=True
            )
        ],
    )


def get_persistence_retention() -> PersistenceRetentionResponse:
    persistence_rates = [80, 81, 83, 82, 84, 84]
    retention_rates = [65, 67, 68, 67, 70, 72]
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
            PersistenceRetentionRow(
                cohort_year=year, persistence=persistence_rate, retention=retention_rate
            )
            for year, persistence_rate, retention_rate in zip(
                COHORT_YEARS, persistence_rates, retention_rates, strict=True
            )
        ],
    )


def get_completion_by_group() -> CompletionByGroupResponse:
    rate_by_group = [
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
        rows=[CompletionByGroupRow(group=group, rate=rate) for group, rate in rate_by_group],
    )


def get_persistence_by_age() -> PersistenceByAgeResponse:
    # (age group, persistence rate, gateway completion rate)
    rates_by_age = [
        ("Ages 18 to 24", 78, 74),
        ("Ages 25 to 34", 71, 66),
        ("Ages 35 and over", 64, 58),
    ]
    return PersistenceByAgeResponse(
        meta=ChartMeta(
            title="Persistence and gateway course completion by age group",
            description="Both rates fall with each older age group.",
            takeaway="Students 35 and over persist 14 points less often than students 18 to 24.",
            fields_used=["Gateway, persistence (PDP)", "Age (campus)"],
        ),
        rows=[
            PersistenceByAgeRow(
                age_group=age_group,
                persistence=persistence_rate,
                gateway_completion=gateway_rate,
            )
            for age_group, persistence_rate, gateway_rate in rates_by_age
        ],
    )


def get_time_to_complete() -> TimeToCompleteResponse:
    average_terms_by_entry = [("Fall start", 5.1), ("Spring start", 5.8), ("Summer start", 6.3)]
    return TimeToCompleteResponse(
        meta=ChartMeta(
            title="Time to complete by entry term",
            description="Average terms from first enrollment to completion.",
            takeaway="Students who start in summer take over a term longer than fall starters.",
            fields_used=["Entry term (campus)", "Completion (PDP)"],
        ),
        rows=[
            TimeToCompleteRow(entry_term=entry_term, average_terms=average_terms)
            for entry_term, average_terms in average_terms_by_entry
        ],
    )
