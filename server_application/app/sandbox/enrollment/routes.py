"""/sandbox/enrollment: the worked example of adding a sandbox page.

Copy this folder to app/sandbox/<topic>/ to add your own, then add it to app/sandbox/router.py.
"""

from fastapi import APIRouter

from . import mock_data
from .schemas import EnrollmentByModalityResponse, EnrollmentByProgramResponse

router = APIRouter(prefix="/sandbox/enrollment", tags=["sandbox: enrollment"])


@router.get("/by-modality")
async def by_modality() -> EnrollmentByModalityResponse:
    """Share of credit hours in person vs online, last six terms."""
    return mock_data.get_enrollment_by_modality()


@router.get("/by-program")
async def by_program() -> EnrollmentByProgramResponse:
    """Share of fall 2025 students per program area."""
    return mock_data.get_enrollment_by_program()
