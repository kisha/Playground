"""A typed, filtered Measures endpoint for the Playground Sandbox."""

from typing import Annotated

from fastapi import APIRouter, Query

from . import results
from .schemas import Cohort, GroupBy, GroupRateResponse, Measure

router = APIRouter(prefix="/sandbox/measures")


@router.get("/by-group")
async def by_group(
    measure: Annotated[Measure, Query()] = "gateway_math",
    cohort: Annotated[Cohort, Query()] = "2022-23",
    group_by: Annotated[GroupBy, Query()] = "gender",
) -> GroupRateResponse:
    """Return one filtered measure broken out by one student group."""
    return results.get_by_group(measure, cohort, group_by)
