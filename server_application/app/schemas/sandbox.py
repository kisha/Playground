"""Response shapes for the sandbox: mock PDP AR-style data that powers the example charts."""

from typing import Literal

from pydantic import BaseModel, Field


class ChartMeta(BaseModel):
    title: str
    description: str
    takeaway: str | None = Field(default=None, description="One-sentence reading of the chart.")
    fields_used: list[str] = Field(description="AR file fields the numbers come from.")
    filters: list[str] = Field(default=[], description='Cohort filters, e.g. "Fall entry".')
    definitions: dict[str, str] = Field(default={}, description="How each measure is defined.")
    source: Literal["mock"] = "mock"


class Kpi(BaseModel):
    id: str
    label: str
    unit: Literal["percent", "split", "terms"]
    value: float
    secondary_value: float | None = Field(
        default=None, description='Second half of a split, e.g. 36 in "64 / 36".'
    )
    detail: str


class KpiResponse(BaseModel):
    meta: ChartMeta
    items: list[Kpi]


class GatewayCompletionRow(BaseModel):
    term: str
    english: float
    math: float


class GatewayCompletionResponse(BaseModel):
    meta: ChartMeta
    rows: list[GatewayCompletionRow]


class TermEnrollmentRow(BaseModel):
    term: str
    enrolled_next_term: float
    into_fall: bool = Field(description="True when the term measures continuing into fall.")


class TermEnrollmentResponse(BaseModel):
    meta: ChartMeta
    rows: list[TermEnrollmentRow]


class CreditCompletionRow(BaseModel):
    cohort_year: int
    new: float
    transfer: float


class CreditCompletionResponse(BaseModel):
    meta: ChartMeta
    rows: list[CreditCompletionRow]


class PersistenceRetentionRow(BaseModel):
    cohort_year: int
    persistence: float
    retention: float


class PersistenceRetentionResponse(BaseModel):
    meta: ChartMeta
    rows: list[PersistenceRetentionRow]


class GroupRateRow(BaseModel):
    group: str
    rate: float


class CompletionByGroupResponse(BaseModel):
    meta: ChartMeta
    rows: list[GroupRateRow]


class PersistenceByAgeRow(BaseModel):
    age_group: str
    persistence: float
    gateway_completion: float


class PersistenceByAgeResponse(BaseModel):
    meta: ChartMeta
    rows: list[PersistenceByAgeRow]


class TimeToCompleteRow(BaseModel):
    entry_term: str
    average_terms: float


class TimeToCompleteResponse(BaseModel):
    meta: ChartMeta
    rows: list[TimeToCompleteRow]
