"""
CCTV-X Cameras API – v1  (Sprint 2)

Endpoints:
  GET    /cameras          – list all cameras (paginated)
  POST   /cameras          – register a new camera
  GET    /cameras/{id}     – get a single camera
  PATCH  /cameras/{id}     – update camera fields
  DELETE /cameras/{id}     – remove a camera
  PATCH  /cameras/{id}/status – toggle active / status
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.camera import Camera, CameraStatus
from app.schemas.camera import (
    CameraCreate,
    CameraListResponse,
    CameraRead,
    CameraUpdate,
)

logger = structlog.get_logger(__name__)
router = APIRouter(prefix="/cameras", tags=["Cameras"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _get_camera_or_404(camera_id: int, db: AsyncSession) -> Camera:
    """Fetch a camera by ID or raise HTTP 404."""
    result = await db.get(Camera, camera_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Camera with id={camera_id} not found.",
        )
    return result


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=CameraListResponse,
    summary="List cameras",
    description="Returns a paginated list of all registered cameras.",
)
async def list_cameras(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
    status_filter: Optional[CameraStatus] = Query(None, alias="status", description="Filter by camera status"),
    is_active: Optional[bool] = Query(None, description="Filter by active flag"),
    db: AsyncSession = Depends(get_db),
) -> CameraListResponse:
    # Build count query
    count_q = select(func.count(Camera.id))
    list_q  = select(Camera).order_by(Camera.created_at.desc())

    if status_filter is not None:
        count_q = count_q.where(Camera.status == status_filter)
        list_q  = list_q.where(Camera.status == status_filter)

    if is_active is not None:
        count_q = count_q.where(Camera.is_active == is_active)
        list_q  = list_q.where(Camera.is_active == is_active)

    total_result = await db.execute(count_q)
    total = total_result.scalar_one()

    offset = (page - 1) * page_size
    list_result = await db.execute(list_q.offset(offset).limit(page_size))
    cameras = list_result.scalars().all()

    logger.info("cameras.list", total=total, page=page, page_size=page_size)
    return CameraListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[CameraRead.model_validate(c) for c in cameras],
    )


@router.post(
    "",
    response_model=CameraRead,
    status_code=status.HTTP_201_CREATED,
    summary="Register camera",
    description="Add a new camera source to the system.",
)
async def create_camera(
    payload: CameraCreate,
    db: AsyncSession = Depends(get_db),
) -> CameraRead:
    camera = Camera(
        name=payload.name,
        description=payload.description,
        location=payload.location,
        stream_url=payload.stream_url,
        protocol=payload.protocol,
        is_active=payload.is_active,
        status=CameraStatus.inactive,
        resolution_width=payload.resolution_width,
        resolution_height=payload.resolution_height,
        fps=payload.fps,
    )
    db.add(camera)
    await db.flush()   # get the generated ID before commit
    await db.refresh(camera)
    logger.info("cameras.created", id=camera.id, name=camera.name)
    return CameraRead.model_validate(camera)


@router.get(
    "/{camera_id}",
    response_model=CameraRead,
    summary="Get camera",
    description="Retrieve full details of a single camera.",
)
async def get_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
) -> CameraRead:
    camera = await _get_camera_or_404(camera_id, db)
    return CameraRead.model_validate(camera)


@router.patch(
    "/{camera_id}",
    response_model=CameraRead,
    summary="Update camera",
    description="Partially update camera fields (PATCH semantics – only supplied fields are changed).",
)
async def update_camera(
    camera_id: int,
    payload: CameraUpdate,
    db: AsyncSession = Depends(get_db),
) -> CameraRead:
    camera = await _get_camera_or_404(camera_id, db)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(camera, field, value)

    camera.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(camera)
    logger.info("cameras.updated", id=camera.id, fields=list(update_data.keys()))
    return CameraRead.model_validate(camera)


@router.delete(
    "/{camera_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete camera",
    description="Permanently remove a camera from the system.",
)
async def delete_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    camera = await _get_camera_or_404(camera_id, db)
    await db.delete(camera)
    logger.info("cameras.deleted", id=camera_id, name=camera.name)


@router.patch(
    "/{camera_id}/toggle",
    response_model=CameraRead,
    summary="Toggle camera active state",
    description="Flip the is_active flag for a camera (enable / disable).",
)
async def toggle_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
) -> CameraRead:
    camera = await _get_camera_or_404(camera_id, db)
    camera.is_active = not camera.is_active
    camera.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(camera)
    logger.info("cameras.toggled", id=camera.id, is_active=camera.is_active)
    return CameraRead.model_validate(camera)
