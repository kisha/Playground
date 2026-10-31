"""/sandbox/chart-examples: one endpoint for every example chart."""

from typing import Annotated

from fastapi import APIRouter, Query

from .mock_data import CHART_LOADERS
from .schemas import ChartExample, ChartName

router = APIRouter(prefix="/sandbox/chart-examples")


@router.get("")
async def chart_examples(
    charts: Annotated[
        list[ChartName] | None, Query(description="Leave out for every chart.")
    ] = None,
) -> dict[ChartName, ChartExample]:
    """The charts named in ?charts=, each by its name. Repeat charts= to ask for several."""
    return {chart_name: CHART_LOADERS[chart_name]() for chart_name in charts or ChartName}
