"""Filter example one: gateway completion for a filtered view. The numbers are invented."""

from app.sandbox.shared import COHORT_YEARS, ChartMeta

from .schemas import (
    FilteredCompletionResponse,
    FilteredGroupRow,
    FilteredKpis,
    FilteredTrendRow,
    FilterExampleQuery,
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
# (English, math) per cohort.
GATEWAY_RATES_BY_COHORT = dict(
    zip(COHORT_YEARS, [(70, 58), (72, 60), (71, 58), (74, 61), (73, 60), (74, 62)], strict=True)
)
GROUP_RATES = [("Female", 70), ("Male", 64), ("New", 72), ("Transfer", 58), ("First-gen", 66)]
# Which filter each group belongs to: its own filter doesn't shift its bar.
GROUP_FILTERS = {
    "Female": "gender",
    "Male": "gender",
    "New": "enrollment_type",
    "Transfer": "enrollment_type",
    "First-gen": "first_gen",
}


def _clamp_rate(rate: float) -> float:
    return min(100, max(0, rate))


def get_filtered_completion(query: FilterExampleQuery) -> FilteredCompletionResponse:
    chosen = {
        "enrollment_type": query.enrollment_type,
        "gender": query.gender,
        "first_gen": query.first_gen,
        "course_modality": query.course_modality,
    }
    chosen_values = [value for value in chosen.values() if value]
    adjustment = sum(FILTER_ADJUSTMENTS[value] for value in chosen_values)
    english, math = GATEWAY_RATES_BY_COHORT[query.cohort_year]
    english_rate = _clamp_rate(english + adjustment)
    math_rate = _clamp_rate(math + adjustment)
    applied_filters = [str(query.cohort_year), *chosen_values]

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
                        for key, value in chosen.items()
                        if value and key != GROUP_FILTERS[group]
                    )
                ),
            )
            for group, rate in GROUP_RATES
        ],
    )
