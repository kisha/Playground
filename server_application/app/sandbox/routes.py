"""/sandbox: mock PDP AR-style data for the example charts. Mounted by app/sandbox/router.py."""

from fastapi import APIRouter

from app.sandbox.shared import KpiResponse

from . import mock_data
from .schemas import (
    CompletionByGroupResponse,
    CreditCompletionResponse,
    GatewayCompletionResponse,
    PersistenceByAgeResponse,
    PersistenceRetentionResponse,
    TermEnrollmentResponse,
    TimeToCompleteResponse,
)

router = APIRouter(prefix="/sandbox", tags=["sandbox"])


@router.get("/kpis")
async def kpis() -> KpiResponse:
    """Headline measures for KPI cards, including splits like Female / Male."""
    return mock_data.get_kpis()


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
