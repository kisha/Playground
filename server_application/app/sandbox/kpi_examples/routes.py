"""/sandbox/kpi-examples: one endpoint for every group of KPI cards."""

from typing import Annotated

from fastapi import APIRouter, Query

from app.sandbox.shared import KpiResponse

from .mock_data import CHART_LOADERS
from .schemas import ChartName

router = APIRouter(prefix="/sandbox/kpi-examples")


@router.get("")
async def kpi_examples(
    charts: Annotated[
        list[ChartName] | None, Query(description="Leave out for every group.")
    ] = None,
) -> dict[ChartName, KpiResponse]:
    """The groups named in ?charts=, each by its name. Repeat charts= to ask for several."""
    return {chart_name: CHART_LOADERS[chart_name]() for chart_name in charts or ChartName}
