"""Mock data for /sandbox/enrollment. The numbers are invented."""

from app.sandbox.shared import TERMS, ChartMeta

from .schemas import (
    EnrollmentByModalityResponse,
    EnrollmentByModalityRow,
    EnrollmentByProgramResponse,
    EnrollmentByProgramRow,
)


def get_enrollment_by_modality() -> EnrollmentByModalityResponse:
    # (in-person share, online share) per term
    shares_by_term = [(68, 32), (64, 36), (63, 37), (59, 41), (58, 42), (55, 45)]
    return EnrollmentByModalityResponse(
        meta=ChartMeta(
            title="Enrollment by modality, term by term",
            description="Share of credit hours taken in person vs online, last six terms.",
            takeaway="Online's share of credit hours grew 13 points in three years.",
            fields_used=["Course modality (campus)", "Credits attempted"],
        ),
        rows=[
            EnrollmentByModalityRow(term=term, in_person=in_person_share, online=online_share)
            for term, (in_person_share, online_share) in zip(TERMS, shares_by_term, strict=True)
        ],
    )


def get_enrollment_by_program() -> EnrollmentByProgramResponse:
    share_by_program = [
        ("Health sciences", 27),
        ("Business", 21),
        ("Liberal arts", 18),
        ("STEM", 16),
        ("Trades and technical", 12),
        ("Undeclared", 6),
    ]
    return EnrollmentByProgramResponse(
        meta=ChartMeta(
            title="Enrollment by program area",
            description="Share of fall 2025 students in each program area.",
            takeaway="Health sciences and business enroll almost half of all students.",
            fields_used=["Program of study", "Cohort"],
            filters=["Fall 2025"],
        ),
        rows=[
            EnrollmentByProgramRow(program=program, share=share)
            for program, share in share_by_program
        ],
    )
