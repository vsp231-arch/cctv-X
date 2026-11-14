"""
CCTV-X Camera Model – Sprint 2
SQLAlchemy ORM model representing a registered camera source.
"""

from __future__ import annotations

import enum
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class CameraStatus(str, enum.Enum):
    """Lifecycle state of a camera source."""
    active   = "active"
    inactive = "inactive"
    error    = "error"


class CameraProtocol(str, enum.Enum):
    """Supported stream protocols."""
    rtsp  = "rtsp"
    rtmp  = "rtmp"
    http  = "http"
    https = "https"
    file  = "file"   # local video file (dev/testing)


class Camera(Base):
    """
    Represents a registered camera / video source.

    Each camera has:
    - A human-readable name and optional description
    - A stream URL (RTSP, RTMP, HTTP, or local path)
    - A protocol tag and status flag
    - Audit timestamps (created_at / updated_at)
    """

    __tablename__ = "cameras"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # ── Identity ──────────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # ── Stream ────────────────────────────────────────────────────────────────
    stream_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    protocol: Mapped[CameraProtocol] = mapped_column(
        Enum(CameraProtocol, name="cameraprotocol"),
        default=CameraProtocol.rtsp,
        nullable=False,
    )

    # ── State ─────────────────────────────────────────────────────────────────
    status: Mapped[CameraStatus] = mapped_column(
        Enum(CameraStatus, name="camerastatus"),
        default=CameraStatus.inactive,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # ── Resolution / metadata ─────────────────────────────────────────────────
    resolution_width: Mapped[int | None]  = mapped_column(Integer, nullable=True)
    resolution_height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fps: Mapped[int | None]               = mapped_column(Integer, nullable=True)

    # ── Audit ─────────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Camera id={self.id} name={self.name!r} status={self.status}>"
