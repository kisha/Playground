"""Response shapes for /sandbox/chart-examples: mock PDP AR-style data, one shape per chart."""

from enum import StrEnum

from pydantic import BaseModel, Field

from app.sandbox.shared import ChartResponse


class ChartName(StrEnum):
    """Every chart, by the name that ?charts= asks for it with."""

    GATEWAY_COMPLETION = "gateway-completion"
    TERM_ENROLLMENT = "term-enrollment"
    CREDIT_COMPLETION = "credit-completion"
    PERSISTENCE_RETENTION = "persistence-retention"
    COMPLETION_BY_GROUP = "completion-by-group"
    PERSISTENCE_BY_AGE = "persistence-by-age"
    TIME_TO_COMPLETE = "time-to-complete"
    ENTRY_STATUS_SHARE = "entry-status-share"
    GENDER_SHARE = "gender-share"
    CREDIT_LOAD = "credit-load"
    HEADCOUNT = "headcount"


class GatewayCompletionRow(BaseModel):
    term: str
    english: float
    math: float


GatewayCompletionResponse = ChartResponse[GatewayCompletionRow]


class TermEnrollmentRow(BaseModel):
    term: str
    enrolled_next_term: float
    into_fall: bool = Field(description="True when the term measures continuing into fall.")


TermEnrollmentResponse = ChartResponse[TermEnrollmentRow]


class CreditCompletionRow(BaseModel):
    cohort_year: int
    new: float
    transfer: float


CreditCompletionResponse = ChartResponse[CreditCompletionRow]


class PersistenceRetentionRow(BaseModel):
    cohort_year: int
    persistence: float
    retention: float


PersistenceRetentionResponse = ChartResponse[PersistenceRetentionRow]


class CompletionByGroupRow(BaseModel):
    group: str
    rate: float


CompletionByGroupResponse = ChartResponse[CompletionByGroupRow]


class PersistenceByAgeRow(BaseModel):
    age_group: str
    persistence: float
    gateway_completion: float


PersistenceByAgeResponse = ChartResponse[PersistenceByAgeRow]


class TimeToCompleteRow(BaseModel):
    entry_term: str
    average_terms: float


TimeToCompleteResponse = ChartResponse[TimeToCompleteRow]


class EntryStatusShareRow(BaseModel):
    status: str
    share: float


EntryStatusShareResponse = ChartResponse[EntryStatusShareRow]


class GenderShareRow(BaseModel):
    gender: str
    share: float


GenderShareResponse = ChartResponse[GenderShareRow]


class CreditLoadRow(BaseModel):
    cohort_year: int
    full_time: float
    three_quarter: float
    half_time_or_less: float


CreditLoadResponse = ChartResponse[CreditLoadRow]


class HeadcountRow(BaseModel):
    term: str
    students: int


HeadcountResponse = ChartResponse[HeadcountRow]


ChartExample = (
    GatewayCompletionResponse
    | TermEnrollmentResponse
    | CreditCompletionResponse
    | PersistenceRetentionResponse
    | CompletionByGroupResponse
    | PersistenceByAgeResponse
    | TimeToCompleteResponse
    | EntryStatusShareResponse
    | GenderShareResponse
    | CreditLoadResponse
    | HeadcountResponse
)
