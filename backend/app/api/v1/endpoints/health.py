"""
CCTV-X Health Check API – v1
"""

from __future__ import annotations

import time
from datetime import datetime, timezone

import structlog
from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db

logger = structlog.get_logger(__name__)
router = APIRouter(prefix="/health", tags=["Health"])

# Track startup time for uptime reporting
_START_TIME = time.monotonic()


@router.get(
    "",
    summary="Health check",
    description=(
        "Returns the current health status of the CCTV-X backend including "
        "database connectivity and basic system information."
    ),
    response_description="Health status payload",
)
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Lightweight health-check endpoint.

    Checks:
    - API server reachability
    - Database connectivity (async ping)

    Returns HTTP 200 on success, HTTP 503 if any component is degraded.
    """
    uptime_seconds = round(time.monotonic() - _START_TIME, 2)
    db_status = "ok"
    db_error: str | None = None

    try:
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = "degraded"
        db_error = str(exc)
        logger.warning("Health check: DB unreachable", error=db_error)

    overall = "healthy" if db_status == "ok" else "degraded"
    http_status = (
        status.HTTP_200_OK if overall == "healthy" else status.HTTP_503_SERVICE_UNAVAILABLE
    )

    payload = {
        "status": overall,
        "version": settings.VERSION,
        "environment": settings.ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "uptime_seconds": uptime_seconds,
        "components": {
            "api": "ok",
            "database": db_status,
        },
    }
    if db_error:
        payload["components"]["database_error"] = db_error

    logger.info("Health check", status=overall, uptime=uptime_seconds)
    from fastapi.responses import JSONResponse

    return JSONResponse(content=payload, status_code=http_status)
