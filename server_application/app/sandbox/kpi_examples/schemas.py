"""Names for /sandbox/kpi-examples. Every group answers with the shared KpiResponse."""

from enum import StrEnum


class ChartName(StrEnum):
    """Every group of KPI cards, by the name that ?charts= asks for it with."""

    STUDENT_PROGRESS = "student-progress"
    STUDENT_MIX = "student-mix"
    TIME_TO_COMPLETE = "time-to-complete"
