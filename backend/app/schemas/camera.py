"""
CCTV-X Camera Pydantic Schemas – Sprint 2
Request/response schemas for camera CRUD operations.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.camera import CameraProtocol, CameraStatus


# ---------------------------------------------------------------------------
# Shared / Base
# ---------------------------------------------------------------------------

class CameraBase(BaseModel):
    """Fields shared between create and update."""

    name: str = Field(..., min_length=1, max_length=120, examples=["Front Gate Camera"])
    description: Optional[str] = Field(None, examples=["Wide-angle view of the main entrance"])
    location: Optional[str] = Field(None, max_length=255, examples=["Building A – Ground Floor"])
    stream_url: str = Field(
        ...,
        min_length=3,
        max_length=1024,
        examples=["rtsp://192.168.1.10:554/stream1"],
    )
    protocol: CameraProtocol = Field(CameraProtocol.rtsp, examples=["rtsp"])
    is_active: bool = Field(True)
    resolution_width: Optional[int]  = Field(None, ge=1, le=7680, examples=[1920])
    resolution_height: Optional[int] = Field(None, ge=1, le=4320, examples=[1080])
    fps: Optional[int]               = Field(None, ge=1, le=240,  examples=[30])

    @field_validator("stream_url")
    @classmethod
    def validate_stream_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("stream_url cannot be blank")
        return v


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------

class CameraCreate(CameraBase):
    """Payload for POST /cameras."""
    pass


# ---------------------------------------------------------------------------
# Update (all fields optional for PATCH semantics)
# ---------------------------------------------------------------------------

class CameraUpdate(BaseModel):
    """Payload for PATCH /cameras/{id} – every field is optional."""
    model_config = ConfigDict(extra="ignore")

    name: Optional[str]              = Field(None, min_length=1, max_length=120)
    description: Optional[str]      = None
    location: Optional[str]         = Field(None, max_length=255)
    stream_url: Optional[str]       = Field(None, min_length=3, max_length=1024)
    protocol: Optional[CameraProtocol] = None
    status: Optional[CameraStatus]  = None
    is_active: Optional[bool]       = None
    resolution_width: Optional[int] = Field(None, ge=1, le=7680)
    resolution_height: Optional[int]= Field(None, ge=1, le=4320)
    fps: Optional[int]              = Field(None, ge=1, le=240)


# ---------------------------------------------------------------------------
# Read (response)
# ---------------------------------------------------------------------------

class CameraRead(CameraBase):
    """Schema returned from the API (includes DB-generated fields)."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: CameraStatus
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# List response
# ---------------------------------------------------------------------------

class CameraListResponse(BaseModel):
    """Paginated list response for cameras."""
    total: int
    page: int
    page_size: int
    items: list[CameraRead]
