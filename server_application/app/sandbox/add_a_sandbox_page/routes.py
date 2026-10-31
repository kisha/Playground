"""/sandbox/add-a-sandbox-page: the worked example of adding a sandbox page.

One page, one endpoint: each chart is asked for by name with ?charts=.
Copy this folder to app/sandbox/<topic>/ to add your own, then add it to app/sandbox/router.py.
"""

from typing import Annotated

from fastapi import APIRouter, Query

from .mock_data import CHART_LOADERS
from .schemas import ChartExample, ChartName

router = APIRouter(prefix="/sandbox/add-a-sandbox-page")


@router.get("")
async def add_a_sandbox_page(
    charts: Annotated[
        list[ChartName] | None, Query(description="Leave out for every chart.")
    ] = None,
) -> dict[ChartName, ChartExample]:
    """The charts named in ?charts=, each by its name. Repeat charts= to ask for several."""
    return {chart_name: CHART_LOADERS[chart_name]() for chart_name in charts or ChartName}
