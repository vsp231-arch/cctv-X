"""
CCTV-X – test_cameras.py  (Sprint 2)

Tests for the Camera CRUD API endpoints.
Uses an in-memory SQLite database via SQLAlchemy async engine so no PostgreSQL
is required to run the test suite.
"""

from __future__ import annotations

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.main import app
from app.db.session import Base, get_db

# ---------------------------------------------------------------------------
# In-memory async SQLite engine for tests
# ---------------------------------------------------------------------------
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)
TestSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def override_get_db():
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session", autouse=True)
async def create_tables():
    """Create all tables in the in-memory DB once per test session."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(autouse=True)
def _override_db():
    """Override the get_db dependency with the test session factory."""
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def camera_payload():
    return {
        "name": "Test Camera",
        "stream_url": "rtsp://192.168.1.99:554/stream",
        "protocol": "rtsp",
        "description": "A test camera",
        "location": "Test Lab",
        "is_active": True,
        "resolution_width": 1920,
        "resolution_height": 1080,
        "fps": 30,
    }


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestCamerasCRUD:

    async def test_list_cameras_empty(self, client: AsyncClient):
        resp = await client.get("/api/v1/cameras")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 0
        assert data["items"] == []

    async def test_create_camera(self, client: AsyncClient, camera_payload: dict):
        resp = await client.post("/api/v1/cameras", json=camera_payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == camera_payload["name"]
        assert data["stream_url"] == camera_payload["stream_url"]
        assert data["protocol"] == "rtsp"
        assert data["status"] == "inactive"   # default on creation
        assert data["is_active"] is True
        assert data["resolution_width"] == 1920
        assert data["fps"] == 30
        assert "id" in data
        assert "created_at" in data

    async def test_get_camera(self, client: AsyncClient, camera_payload: dict):
        create_resp = await client.post("/api/v1/cameras", json=camera_payload)
        cam_id = create_resp.json()["id"]

        resp = await client.get(f"/api/v1/cameras/{cam_id}")
        assert resp.status_code == 200
        assert resp.json()["id"] == cam_id

    async def test_get_camera_not_found(self, client: AsyncClient):
        resp = await client.get("/api/v1/cameras/99999")
        assert resp.status_code == 404

    async def test_update_camera(self, client: AsyncClient, camera_payload: dict):
        create_resp = await client.post("/api/v1/cameras", json=camera_payload)
        cam_id = create_resp.json()["id"]

        patch = {"name": "Updated Camera Name", "fps": 60}
        resp = await client.patch(f"/api/v1/cameras/{cam_id}", json=patch)
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "Updated Camera Name"
        assert data["fps"] == 60
        # Unchanged field should be preserved
        assert data["stream_url"] == camera_payload["stream_url"]

    async def test_toggle_camera(self, client: AsyncClient, camera_payload: dict):
        create_resp = await client.post("/api/v1/cameras", json=camera_payload)
        cam_id = create_resp.json()["id"]
        original_active = create_resp.json()["is_active"]

        resp = await client.patch(f"/api/v1/cameras/{cam_id}/toggle")
        assert resp.status_code == 200
        assert resp.json()["is_active"] == (not original_active)

    async def test_list_cameras_pagination(self, client: AsyncClient, camera_payload: dict):
        # Create 3 cameras
        for i in range(3):
            payload = {**camera_payload, "name": f"Camera {i}"}
            await client.post("/api/v1/cameras", json=payload)

        resp = await client.get("/api/v1/cameras?page=1&page_size=2")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) <= 2
        assert data["page"] == 1
        assert data["page_size"] == 2

    async def test_delete_camera(self, client: AsyncClient, camera_payload: dict):
        create_resp = await client.post("/api/v1/cameras", json=camera_payload)
        cam_id = create_resp.json()["id"]

        del_resp = await client.delete(f"/api/v1/cameras/{cam_id}")
        assert del_resp.status_code == 204

        get_resp = await client.get(f"/api/v1/cameras/{cam_id}")
        assert get_resp.status_code == 404

    async def test_create_camera_missing_required(self, client: AsyncClient):
        resp = await client.post("/api/v1/cameras", json={"name": "No URL"})
        assert resp.status_code == 422

    async def test_create_camera_blank_url(self, client: AsyncClient):
        resp = await client.post(
            "/api/v1/cameras",
            json={"name": "Bad Camera", "stream_url": "   "},
        )
        assert resp.status_code == 422
