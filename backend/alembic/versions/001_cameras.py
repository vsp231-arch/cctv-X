"""Sprint 2 – cameras table

Revision ID: 001_cameras
Revises:
Create Date: 2026-10-26

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "001_cameras"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create enum types first
    cameraprotocol = sa.Enum(
        "rtsp", "rtmp", "http", "https", "file",
        name="cameraprotocol",
    )
    camerastatus = sa.Enum(
        "active", "inactive", "error",
        name="camerastatus",
    )

    op.create_table(
        "cameras",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("stream_url", sa.String(length=1024), nullable=False),
        sa.Column("protocol", cameraprotocol, nullable=False, server_default="rtsp"),
        sa.Column("status", camerastatus, nullable=False, server_default="inactive"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("resolution_width", sa.Integer(), nullable=True),
        sa.Column("resolution_height", sa.Integer(), nullable=True),
        sa.Column("fps", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_cameras_id"), "cameras", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_cameras_id"), table_name="cameras")
    op.drop_table("cameras")
    op.execute("DROP TYPE IF EXISTS camerastatus")
    op.execute("DROP TYPE IF EXISTS cameraprotocol")
