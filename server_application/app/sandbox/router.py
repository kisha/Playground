"""Every sandbox page's endpoints. main.py mounts this only when SANDBOX_ENABLED."""

from fastapi import APIRouter

from app.sandbox import routes as sandbox
from app.sandbox.add_a_sandbox_page import routes as add_a_sandbox_page

sandbox_router = APIRouter()
sandbox_router.include_router(sandbox.router)
sandbox_router.include_router(add_a_sandbox_page.router)
