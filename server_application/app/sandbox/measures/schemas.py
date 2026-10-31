"""Response shapes for the filtered Sandbox Measures example."""

from typing import Literal

from pydantic import BaseModel

from app.sandbox.shared import ChartResponse

Measure = Literal["retention", "persistence", "gateway_math", "gateway_english"]
Cohort = Literal["2021-22", "2022-23", "2023-24", "2024-25"]
GroupBy = Literal["race", "gender", "pell", "age_band", "enrollment_intensity"]


class GroupRateRow(BaseModel):
    """A display-safe rate for one value in the selected demographic grouping."""

    group: str
    rate: float | None
    n: int | None


class GroupRateResponse(ChartResponse[GroupRateRow]):
    pass
