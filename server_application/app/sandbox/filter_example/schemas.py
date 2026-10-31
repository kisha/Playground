"""Request and response shapes for /sandbox/filter-example: one query, one answer per example."""

from typing import Annotated, Literal

from pydantic import BaseModel, Field

from app.sandbox.shared import COHORT_YEARS, ChartMeta


class FilterExampleQuery(BaseModel):
    """Which example, and its filters."""

    example: Literal["example-one"]
    cohort_year: Annotated[int, Field(ge=COHORT_YEARS[0], le=COHORT_YEARS[-1])] = COHORT_YEARS[-1]
    enrollment_type: Literal["New", "Transfer"] | None = None
    gender: Literal["Female", "Male", "Non-binary"] | None = None
    first_gen: Literal["First-gen", "Not first-gen"] | None = None
    course_modality: Literal["Online", "On-campus"] | None = None


class FilteredKpis(BaseModel):
    gateway_completion: float
    english: float
    math: float


class FilteredTrendRow(BaseModel):
    cohort_year: int
    english: float
    math: float


class FilteredGroupRow(BaseModel):
    group: str
    rate: float


class FilteredCompletionResponse(BaseModel):
    """The whole filtered view in one answer: tiles, trend and group bars."""

    meta: ChartMeta
    applied_filters: list[str]
    kpis: FilteredKpis
    trend: list[FilteredTrendRow]
    groups: list[FilteredGroupRow]
