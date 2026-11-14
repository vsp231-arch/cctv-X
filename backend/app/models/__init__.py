"""Models package – imports all SQLAlchemy models so Alembic can discover them."""

from app.models.camera import Camera  # noqa: F401

__all__ = ["Camera"]
