"""
CCTV-X API v1 – Main Router
Registers all versioned endpoint sub-routers.
"""

from fastapi import APIRouter

from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.cameras import router as cameras_router  # Sprint 2

api_router = APIRouter()

# Health
api_router.include_router(health_router)

# Sprint 2 – Camera management
api_router.include_router(cameras_router)

# Future routers (uncomment as implemented)
# from app.api.v1.endpoints.alerts import router as alerts_router
# from app.api.v1.endpoints.evidence import router as evidence_router
# api_router.include_router(alerts_router)
# api_router.include_router(evidence_router)
