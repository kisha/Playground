"""Mock data for the sandbox, shaped like PDP Analysis-Ready (AR) file outputs.

Labels, filters and definitions follow the PDP measures used in the project briefs. The numbers are
invented and contain no real institution or student data. Replace these functions with real
queries when an instance has AR data of its own.
"""

from app.sandbox.shared import COHORT_YEARS, TERMS, ChartMeta

from .schemas import (
    CompletionByGroupResponse,
    CompletionByGroupRow,
    CreditCompletionResponse,
    CreditCompletionRow,
    CreditLoadResponse,
    CreditLoadRow,
    EntryStatusShareResponse,
    EntryStatusShareRow,
    FilteredCompletionResponse,
    FilteredGroupRow,
    FilteredKpis,
    FilteredTrendRow,
    GatewayCompletionResponse,
    GatewayCompletionRow,
    GenderShareResponse,
    GenderShareRow,
    HeadcountResponse,
    HeadcountRow,
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


def get_entry_status_share() -> EntryStatusShareResponse:
    share_by_status = [
        ("First-time", 46),
        ("Transfer", 31),
        ("Returning", 15),
        ("Dual enrollment", 8),
    ]
    return EntryStatusShareResponse(
        meta=ChartMeta(
            title="Students by entry status",
            description="Share of fall 2025 students by how they entered.",
            takeaway="First-time and transfer students make up over three in four students.",
            fields_used=["Enrollment type (PDP)"],
            filters=["Fall 2025"],
        ),
        rows=[EntryStatusShareRow(status=status, share=share) for status, share in share_by_status],
    )


def get_gender_share() -> GenderShareResponse:
    share_by_gender = [("Female", 62), ("Male", 34), ("Non-binary", 4)]
    return GenderShareResponse(
        meta=ChartMeta(
            title="Students by gender",
            description="Share of fall 2025 students by gender.",
            takeaway="Women make up over six in ten students.",
            fields_used=["Gender (PDP)"],
            filters=["Fall 2025"],
        ),
        rows=[GenderShareRow(gender=gender, share=share) for gender, share in share_by_gender],
    )


def get_credit_load() -> CreditLoadResponse:
    # (full-time, three-quarter, half-time or less), one row per cohort. Each row adds up to 100.
    shares_by_cohort = [
        (62, 22, 16),
        (60, 22, 18),
        (58, 23, 19),
        (57, 24, 19),
        (55, 24, 21),
        (53, 25, 22),
    ]
    return CreditLoadResponse(
        meta=ChartMeta(
            title="Credit load by cohort",
            description="How many credits students take in their first term, fall cohorts.",
            takeaway="The full-time share fell 9 points across six cohorts.",
            fields_used=["Cohort", "Enrollment intensity first term (PDP)"],
            filters=COHORT_FILTERS,
        ),
        rows=[
            CreditLoadRow(
                cohort_year=cohort_year,
                full_time=full_time,
                three_quarter=three_quarter,
                half_time_or_less=half_time_or_less,
            )
            for cohort_year, (full_time, three_quarter, half_time_or_less) in zip(
                COHORT_YEARS, shares_by_cohort, strict=True
            )
        ],
    )


def get_headcount() -> HeadcountResponse:
    students_by_term = [2310, 2140, 2390, 2210, 2480, 2295]
    return HeadcountResponse(
        meta=ChartMeta(
            title="Students enrolled, term by term",
            description="Total headcount, last six terms.",
            takeaway="Fall headcount grew by 170 students in two years, and every spring dips.",
            fields_used=["Term", "Enrollment (campus)"],
        ),
        rows=[
            HeadcountRow(term=term, students=students)
            for term, students in zip(TERMS, students_by_term, strict=True)
        ],
    )


# Points each filter value adds to a rate, so filtering visibly changes the mock numbers.
FILTER_ADJUSTMENTS = {
    "New": 3,
    "Transfer": -5,
    "Female": 2,
    "Male": -3,
    "Non-binary": -1,
    "First-gen": -2,
    "Not first-gen": 1,
    "Online": -6,
    "On-campus": 3,
}
GATEWAY_RATES_BY_COHORT = {
    2020: (70, 58),
    2021: (72, 60),
    2022: (71, 58),
    2023: (74, 61),
    2024: (73, 60),
    2025: (74, 62),
}
GROUP_RATES = [("Female", 70), ("Male", 64), ("New", 72), ("Transfer", 58), ("First-gen", 66)]
# Which filter each group belongs to: its own filter doesn't shift its bar.
GROUP_FILTERS = {"Female": 1, "Male": 1, "New": 0, "Transfer": 0, "First-gen": 2}


def _clamp_rate(rate: float) -> float:
    return min(100, max(0, rate))


def get_filtered_completion(
    cohort_year: int,
    enrollment_type: str | None,
    gender: str | None,
    first_gen: str | None,
    course_modality: str | None,
) -> FilteredCompletionResponse:
    chosen = [enrollment_type, gender, first_gen, course_modality]
    adjustment = sum(FILTER_ADJUSTMENTS[value] for value in chosen if value)
    english, math = GATEWAY_RATES_BY_COHORT[cohort_year]
    english_rate = _clamp_rate(english + adjustment)
    math_rate = _clamp_rate(math + adjustment)
    applied_filters = [str(cohort_year), *(value for value in chosen if value)]

    return FilteredCompletionResponse(
        meta=ChartMeta(
            title="Gateway course completion",
            description="Math and English, for the students these filters select.",
            takeaway=(
                f"For this selection, English completion runs "
                f"{english_rate - math_rate:.0f} points above math."
            ),
            fields_used=["Cohort", "Enrollment type", "Gender", "First gen", "Course modality"],
        ),
        applied_filters=applied_filters,
        kpis=FilteredKpis(
            gateway_completion=round((english_rate + math_rate) / 2),
            english=english_rate,
            math=math_rate,
        ),
        trend=[
            FilteredTrendRow(
                cohort_year=year,
                english=_clamp_rate(english_for_year + adjustment),
                math=_clamp_rate(math_for_year + adjustment),
            )
            for year, (english_for_year, math_for_year) in GATEWAY_RATES_BY_COHORT.items()
        ],
        groups=[
            FilteredGroupRow(
                group=group,
                rate=_clamp_rate(
                    rate
                    + sum(
                        FILTER_ADJUSTMENTS[value]
                        for index, value in enumerate(chosen)
                        if value and index != GROUP_FILTERS[group]
                    )
                ),
            )
            for group, rate in GROUP_RATES
        ],
    )
