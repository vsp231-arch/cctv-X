"""
CCTV-X Configuration Management
Loaded from environment variables / .env file via pydantic-settings.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import List

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Repository root so relative paths work regardless of CWD
ROOT_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Project metadata ──────────────────────────────────────────────────────
    PROJECT_NAME: str = "CCTV-X"
    VERSION: str = "0.2.0"
    ENV: str = "development"           # development | staging | production
    DEBUG: bool = True

    # ── Server ────────────────────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ── Security ──────────────────────────────────────────────────────────────
    SECRET_KEY: str = "change-me-in-production-use-a-long-random-string"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 h

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = (
        "postgresql+asyncpg://cctvx:cctvxpassword@localhost:5432/cctvx_dev"
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Comma-separated list in env: CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # ── Logging ───────────────────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "console"        # console | json

    # ── Storage ───────────────────────────────────────────────────────────────
    MEDIA_DIR: Path = ROOT_DIR / "sample_data"
    EVIDENCE_DIR: Path = ROOT_DIR / "sample_data" / "evidence"

    # ── AI (placeholder – implemented in later sprints) ───────────────────────
    YOLO_MODEL: str = "yolov8n.pt"
    CONFIDENCE_THRESHOLD: float = 0.5


settings = Settings()
