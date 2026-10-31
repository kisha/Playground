"""Every sandbox page's endpoints. main.py mounts this only when SANDBOX_ENABLED."""

from fastapi import APIRouter

from app.sandbox.add_a_sandbox_page import routes as add_a_sandbox_page
from app.sandbox.chart_examples import routes as chart_examples
from app.sandbox.filter_example import routes as filter_example
from app.sandbox.measures import routes as measures

sandbox_router = APIRouter(tags=["sandbox"])
sandbox_router.include_router(chart_examples.router)
sandbox_router.include_router(filter_example.router)
sandbox_router.include_router(measures.router)
sandbox_router.include_router(add_a_sandbox_page.router)
