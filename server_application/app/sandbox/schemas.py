"""Response shapes for /sandbox: mock PDP AR-style data that powers the example charts."""

from pydantic import BaseModel, Field

from app.sandbox.shared import ChartMeta, ChartResponse


class GatewayCompletionRow(BaseModel):
    term: str
    english: float
    math: float


class GatewayCompletionResponse(ChartResponse[GatewayCompletionRow]):
    pass


class TermEnrollmentRow(BaseModel):
    term: str
    enrolled_next_term: float
    into_fall: bool = Field(description="True when the term measures continuing into fall.")


class TermEnrollmentResponse(ChartResponse[TermEnrollmentRow]):
    pass


class CreditCompletionRow(BaseModel):
    cohort_year: int
    new: float
    transfer: float


class CreditCompletionResponse(ChartResponse[CreditCompletionRow]):
    pass


class PersistenceRetentionRow(BaseModel):
    cohort_year: int
    persistence: float
    retention: float


class PersistenceRetentionResponse(ChartResponse[PersistenceRetentionRow]):
    pass


class CompletionByGroupRow(BaseModel):
    group: str
    rate: float


class CompletionByGroupResponse(ChartResponse[CompletionByGroupRow]):
    pass


class PersistenceByAgeRow(BaseModel):
    age_group: str
    persistence: float
    gateway_completion: float


class PersistenceByAgeResponse(ChartResponse[PersistenceByAgeRow]):
    pass


class TimeToCompleteRow(BaseModel):
    entry_term: str
    average_terms: float


class TimeToCompleteResponse(ChartResponse[TimeToCompleteRow]):
    pass


class EntryStatusShareRow(BaseModel):
    status: str
    share: float


class EntryStatusShareResponse(ChartResponse[EntryStatusShareRow]):
    pass


class GenderShareRow(BaseModel):
    gender: str
    share: float


class GenderShareResponse(ChartResponse[GenderShareRow]):
    pass


class CreditLoadRow(BaseModel):
    cohort_year: int
    full_time: float
    three_quarter: float
    half_time_or_less: float


class CreditLoadResponse(ChartResponse[CreditLoadRow]):
    pass


class HeadcountRow(BaseModel):
    term: str
    students: int


class HeadcountResponse(ChartResponse[HeadcountRow]):
    pass


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
    """One answer for a whole filtered view: its tiles, its trend and its group bars."""

    meta: ChartMeta
    applied_filters: list[str]
    kpis: FilteredKpis
    trend: list[FilteredTrendRow]
    groups: list[FilteredGroupRow]
