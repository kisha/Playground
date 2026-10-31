"""/sandbox/filter-example: one endpoint for every filter example, chosen with ?example=."""

from typing import Annotated

from fastapi import APIRouter, Query

from . import example_one
from .schemas import FilteredCompletionResponse, FilterExampleQuery

router = APIRouter(prefix="/sandbox/filter-example")

EXAMPLE_HANDLERS = {"example-one": example_one.get_filtered_completion}


@router.get("")
async def filter_example(
    query: Annotated[FilterExampleQuery, Query()],
) -> FilteredCompletionResponse:
    """A filtered view of gateway completion: tiles, a trend and group bars."""
    return EXAMPLE_HANDLERS[query.example](query)
