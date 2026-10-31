"""Response shapes for /sandbox/add-a-sandbox-page, built on the shared sandbox chart shape."""

from enum import StrEnum

from pydantic import BaseModel

from app.sandbox.shared import ChartResponse


class ChartName(StrEnum):
    """Every chart on this page, by the name that ?charts= asks for it with."""

    BY_MODALITY = "by-modality"
    BY_PROGRAM = "by-program"


class EnrollmentByModalityRow(BaseModel):
    term: str
    in_person: float
    online: float


EnrollmentByModalityResponse = ChartResponse[EnrollmentByModalityRow]


class EnrollmentByProgramRow(BaseModel):
    program: str
    share: float


EnrollmentByProgramResponse = ChartResponse[EnrollmentByProgramRow]

ChartExample = EnrollmentByModalityResponse | EnrollmentByProgramResponse
