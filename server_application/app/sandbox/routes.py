"""/sandbox: mock PDP AR-style data for the example charts. Mounted by app/sandbox/router.py."""

from typing import Annotated, Literal

from fastapi import APIRouter, Query

from . import mock_data
from .schemas import (
    CompletionByGroupResponse,
    CreditCompletionResponse,
    CreditLoadResponse,
    EntryStatusShareResponse,
    FilteredCompletionResponse,
    GatewayCompletionResponse,
    GenderShareResponse,
    HeadcountResponse,
    PersistenceByAgeResponse,
    PersistenceRetentionResponse,
    TermEnrollmentResponse,
    TimeToCompleteResponse,
)

router = APIRouter(prefix="/sandbox", tags=["sandbox"])


@router.get("/gateway-completion")
async def gateway_completion() -> GatewayCompletionResponse:
    """Gateway English vs math, last six terms."""
    return mock_data.get_gateway_completion()


@router.get("/term-enrollment")
async def term_enrollment() -> TermEnrollmentResponse:
    """Term-to-term enrollment, last six terms."""
    return mock_data.get_term_enrollment()


@router.get("/credit-completion")
async def credit_completion() -> CreditCompletionResponse:
    """First-year credit completion, new vs transfer, fall cohorts 2020 to 2025."""
    return mock_data.get_credit_completion()


@router.get("/persistence-retention")
async def persistence_retention() -> PersistenceRetentionResponse:
    """Persistence vs retention, fall cohorts 2020 to 2025, with definitions."""
    return mock_data.get_persistence_retention()


@router.get("/completion-by-group")
async def completion_by_group() -> CompletionByGroupResponse:
    """First-year credit completion per student group."""
    return mock_data.get_completion_by_group()


@router.get("/persistence-by-age")
async def persistence_by_age() -> PersistenceByAgeResponse:
    """Persistence and gateway completion per age group."""
    return mock_data.get_persistence_by_age()


@router.get("/time-to-complete")
async def time_to_complete() -> TimeToCompleteResponse:
    """Average terms to completion per entry term."""
    return mock_data.get_time_to_complete()


@router.get("/entry-status-share")
async def entry_status_share() -> EntryStatusShareResponse:
    """Share of students by entry status, for a pie chart."""
    return mock_data.get_entry_status_share()


@router.get("/gender-share")
async def gender_share() -> GenderShareResponse:
    """Share of students by gender, for a donut chart."""
    return mock_data.get_gender_share()


@router.get("/credit-load")
async def credit_load() -> CreditLoadResponse:
    """First-term credit load per fall cohort, for stacked bars. Each row adds up to 100."""
    return mock_data.get_credit_load()


@router.get("/headcount")
async def headcount() -> HeadcountResponse:
    """Total students enrolled, last six terms, for an area chart."""
    return mock_data.get_headcount()


@router.get("/filtered-completion")
async def filtered_completion(
    cohort_year: Annotated[int, Query(ge=2020, le=2025)] = 2025,
    enrollment_type: Literal["New", "Transfer"] | None = None,
    gender: Literal["Female", "Male", "Non-binary"] | None = None,
    first_gen: Literal["First-gen", "Not first-gen"] | None = None,
    course_modality: Literal["Online", "On-campus"] | None = None,
) -> FilteredCompletionResponse:
    """Gateway completion for a filtered view: tiles, a trend and group bars."""
    return mock_data.get_filtered_completion(
        cohort_year, enrollment_type, gender, first_gen, course_modality
    )
