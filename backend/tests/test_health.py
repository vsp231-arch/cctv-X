"""
CCTV-X Backend Tests – Health Endpoint

Uses pytest-asyncio in auto mode (configured in pyproject.toml).
The database session is mocked — no live PostgreSQL needed.
"""

from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock
from sqlalchemy.exc import OperationalError


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
async def mock_db_session():
    """Async DB session mock that always succeeds SELECT 1."""
    session = AsyncMock()
    session.execute = AsyncMock(return_value=None)
    return session


@pytest.fixture
async def client(mock_db_session):
    """
    Async HTTPX test client wired to the FastAPI app.
    Overrides the get_db dependency with an in-memory mock.
    """
    from app.main import app
    from app.db.session import get_db

    async def override_get_db():
        yield mock_db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac

    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_health_returns_200(client: AsyncClient):
    """Health endpoint returns HTTP 200 when all components are healthy."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_response_schema(client: AsyncClient):
    """Health response body contains all required keys."""
    response = await client.get("/api/v1/health")
    data = response.json()

    assert "status" in data
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data
    assert "uptime_seconds" in data
    assert "components" in data
    assert data["components"]["api"] == "ok"


@pytest.mark.asyncio
async def test_health_status_is_healthy(client: AsyncClient):
    """Overall status is 'healthy' when the DB mock succeeds."""
    response = await client.get("/api/v1/health")
    data = response.json()
    assert data["status"] == "healthy"
    assert data["components"]["database"] == "ok"


@pytest.mark.asyncio
async def test_health_version(client: AsyncClient):
    """Health endpoint reports the correct application version."""
    from app.core.config import settings

    response = await client.get("/api/v1/health")
    data = response.json()
    assert data["version"] == settings.VERSION


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    """Root '/' returns a friendly JSON message with docs link."""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data


@pytest.mark.asyncio
async def test_health_degraded_when_db_fails():
    """Health endpoint returns 503 + 'degraded' when the DB is unreachable."""
    from app.main import app
    from app.db.session import get_db

    broken_session = AsyncMock()
    broken_session.execute = AsyncMock(
        side_effect=OperationalError("connection refused", {}, None)
    )

    async def override_get_db_broken():
        yield broken_session

    app.dependency_overrides[get_db] = override_get_db_broken

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        response = await ac.get("/api/v1/health")

    app.dependency_overrides.clear()

    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "degraded"
    assert data["components"]["database"] == "degraded"
