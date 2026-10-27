"""Sandbox: enrollment charts, the worked example of adding a sandbox router.

Copy this file, its schema and its service to add your own; see /sandbox/enrollment.
Mounted only when SANDBOX_ENABLED.
"""

from fastapi import APIRouter

from app.schemas.sandbox_enrollment import EnrollmentByModalityResponse, EnrollmentByProgramResponse
from app.services import sandbox_enrollment as service

router = APIRouter(prefix="/sandbox/enrollment", tags=["sandbox: enrollment"])


@router.get("/by-modality")
async def by_modality() -> EnrollmentByModalityResponse:
    """Share of credit hours in person vs online, last six terms."""
    return service.get_enrollment_by_modality()


@router.get("/by-program")
async def by_program() -> EnrollmentByProgramResponse:
    """Share of fall 2025 students per program area."""
    return service.get_enrollment_by_program()
