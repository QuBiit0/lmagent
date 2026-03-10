import pytest
from httpx import AsyncClient

class TestUsersAPI:
    """Tests de integración para Users API."""
    
    @pytest.mark.asyncio
    async def test_create_user_endpoint(self, client: AsyncClient):
        """POST /users debe crear usuario y retornar 201."""
        response = await client.post("/users/", json={
            "email": "new@example.com",
            "name": "New User"
        })
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "new@example.com"
        assert "id" in data
    
    @pytest.mark.asyncio
    async def test_get_user_not_found(self, client: AsyncClient):
        """GET /users/{id} debe retornar 404 si no existe."""
        response = await client.get("/users/99999")
        
        assert response.status_code == 404