"""Shared by every sandbox page: the response shapes and the mock terms and cohorts."""

from typing import Literal

from pydantic import BaseModel, Field

TERMS = ["Fall 23", "Spr 24", "Fall 24", "Spr 25", "Fall 25", "Spr 26"]
COHORT_YEARS = [2020, 2021, 2022, 2023, 2024, 2025]


class ChartMeta(BaseModel):
    title: str
    description: str
    takeaway: str | None = Field(default=None, description="One-sentence reading of the chart.")
    fields_used: list[str] = Field(description="AR file fields the numbers come from.")
    filters: list[str] = Field(default=[], description='Cohort filters, e.g. "Fall entry".')
    definitions: dict[str, str] = Field(default={}, description="How each measure is defined.")
    source: Literal["mock"] = "mock"


class ChartResponse[RowT: BaseModel](BaseModel):
    """Every chart endpoint answers with its meta plus one row per point or bar."""

    meta: ChartMeta
    rows: list[RowT]
