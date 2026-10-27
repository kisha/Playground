"""Response shapes for the enrollment sandbox examples, built on the shared sandbox chart shape."""

from pydantic import BaseModel

from app.schemas.sandbox import ChartResponse


class EnrollmentByModalityRow(BaseModel):
    term: str
    in_person: float
    online: float


class EnrollmentByModalityResponse(ChartResponse[EnrollmentByModalityRow]):
    pass


class EnrollmentByProgramRow(BaseModel):
    program: str
    share: float


class EnrollmentByProgramResponse(ChartResponse[EnrollmentByProgramRow]):
    pass
