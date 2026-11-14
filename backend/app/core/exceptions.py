"""
CCTV-X – Global exception handlers and custom exception classes.
"""

from __future__ import annotations

import structlog
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = structlog.get_logger(__name__)


# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------


class CCTVXError(Exception):
    """Base error for all CCTV-X domain exceptions."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class NotFoundError(CCTVXError):
    def __init__(self, resource: str, resource_id: str | int) -> None:
        super().__init__(
            f"{resource} with id '{resource_id}' not found.",
            status_code=status.HTTP_404_NOT_FOUND,
        )


class ConflictError(CCTVXError):
    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=status.HTTP_409_CONFLICT)


class AuthenticationError(CCTVXError):
    def __init__(self, message: str = "Authentication failed") -> None:
        super().__init__(message, status_code=status.HTTP_401_UNAUTHORIZED)


# ---------------------------------------------------------------------------
# FastAPI exception handlers  (register these on the FastAPI app)
# ---------------------------------------------------------------------------


async def cctvx_exception_handler(request: Request, exc: CCTVXError) -> JSONResponse:
    logger.warning(
        "Domain exception",
        path=str(request.url),
        error=exc.message,
        status_code=exc.status_code,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "status_code": exc.status_code},
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    logger.warning("Validation error", path=str(request.url), errors=exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation failed",
            "details": exc.errors(),
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception", path=str(request.url), exc_info=exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "An unexpected error occurred. Please try again later.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        },
    )
