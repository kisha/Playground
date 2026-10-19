"""Sandbox: mock PDP AR-style data for the example charts. Mounted only when SANDBOX_ENABLED."""

from fastapi import APIRouter

from app.schemas.sandbox import (
    CompletionByGroupResponse,
    CreditCompletionResponse,
    GatewayCompletionResponse,
    KpiResponse,
    PersistenceByAgeResponse,
    PersistenceRetentionResponse,
    TermEnrollmentResponse,
    TimeToCompleteResponse,
)
from app.services import sandbox as service

router = APIRouter(prefix="/sandbox", tags=["sandbox"])


@router.get("/kpis")
async def kpis() -> KpiResponse:
    """Headline measures for KPI cards, including splits like Female / Male."""
    return service.get_kpis()


@router.get("/gateway-completion")
async def gateway_completion() -> GatewayCompletionResponse:
    """Gateway English vs math, last six terms."""
    return service.get_gateway_completion()


@router.get("/term-enrollment")
async def term_enrollment() -> TermEnrollmentResponse:
    """Term-to-term enrollment, last six terms."""
    return service.get_term_enrollment()


@router.get("/credit-completion")
async def credit_completion() -> CreditCompletionResponse:
    """First-year credit completion, new vs transfer, fall cohorts 2020 to 2025."""
    return service.get_credit_completion()


@router.get("/persistence-retention")
async def persistence_retention() -> PersistenceRetentionResponse:
    """Persistence vs retention, fall cohorts 2020 to 2025, with definitions."""
    return service.get_persistence_retention()


@router.get("/completion-by-group")
async def completion_by_group() -> CompletionByGroupResponse:
    """First-year credit completion per student group."""
    return service.get_completion_by_group()


@router.get("/persistence-by-age")
async def persistence_by_age() -> PersistenceByAgeResponse:
    """Persistence and gateway completion per age group."""
    return service.get_persistence_by_age()


@router.get("/time-to-complete")
async def time_to_complete() -> TimeToCompleteResponse:
    """Average terms to completion per entry term."""
    return service.get_time_to_complete()
