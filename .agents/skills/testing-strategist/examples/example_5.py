import pytest
from httpx import AsyncClient

@pytest.fixture
async def client(app):
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_create_user_returns_201(client):
    response = await client.post("/api/v1/users", json={
        "name": "Leo",
        "email": "leo@test.com"
    })
    assert response.status_code == 201
    assert response.json()["data"]["name"] == "Leo"

@pytest.mark.asyncio
async def test_create_user_duplicate_email_returns_409(client):
    user_data = {"name": "Leo", "email": "leo@test.com"}
    await client.post("/api/v1/users", json=user_data)
    
    response = await client.post("/api/v1/users", json=user_data)
    assert response.status_code == 409