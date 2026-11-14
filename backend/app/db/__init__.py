"""DB package init – re-exports Base so Alembic can discover all models."""

from app.db.session import Base  # noqa: F401
