"""One JSON shape for every error the API returns:

    {"error": {"status": 404, "code": "not_found", "message": "...", "path": "/api/v1/..."}}

Unknown endpoints also get a pointer to the docs (outside production). Unexpected exceptions are
logged in full on the server and reach the client only as a generic message.
"""

import logging
from http import HTTPStatus
from typing import Any

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings

logger = logging.getLogger(__name__)


class ErrorBody(BaseModel):
    status: int
    code: str
    message: str
    path: str
    details: list[Any] | None = None
    docs: str | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody


def _code(status: int) -> str:
    try:
        return HTTPStatus(status).phrase.lower().replace(" ", "_").replace("-", "_")
    except ValueError:
        return "error"


def _response(request: Request, body: ErrorBody, headers: dict[str, str] | None = None):
    return JSONResponse(
        status_code=body.status,
        content=jsonable_encoder(ErrorResponse(error=body), exclude_none=True),
        headers=headers,
    )


async def _http_error(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    route_missing = exc.status_code == 404 and exc.detail == "Not Found"
    message = (
        f"No endpoint matches {request.method} {request.url.path}."
        if route_missing
        else str(exc.detail)
    )
    docs = "/docs" if route_missing and not settings.is_production else None
    body = ErrorBody(
        status=exc.status_code,
        code=_code(exc.status_code),
        message=message,
        path=request.url.path,
        docs=docs,
    )
    return _response(request, body, headers=getattr(exc, "headers", None))


async def _validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    body = ErrorBody(
        status=422,
        code="validation_error",
        message="The request was not valid. See details for each field.",
        path=request.url.path,
        details=list(exc.errors()),
    )
    return _response(request, body)


async def _unhandled_error(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    body = ErrorBody(
        status=500,
        code="internal_error",
        message="Something went wrong on our side. Please try again.",
        path=request.url.path,
    )
    return _response(request, body)


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, _http_error)
    app.add_exception_handler(RequestValidationError, _validation_error)
    app.add_exception_handler(Exception, _unhandled_error)
