from fastapi import APIRouter

from app.api.v1.routes import documents, health, sandbox, sandbox_enrollment

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(documents.router)

# Mock-data endpoints for the sandbox pages. main.py mounts these only when SANDBOX_ENABLED.
sandbox_router = APIRouter()
sandbox_router.include_router(sandbox.router)
sandbox_router.include_router(sandbox_enrollment.router)
