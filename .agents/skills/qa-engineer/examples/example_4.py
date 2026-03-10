import pytest
from app.services.user_service import UserService
from app.core.exceptions import ValidationError

class TestUserService:
    """Tests para UserService."""
    
    @pytest.mark.asyncio
    async def test_create_user_success(self, mock_repository):
        """Debe crear usuario cuando datos son válidos."""
        service = UserService(repository=mock_repository)
        
        result = await service.create({
            "email": "valid@example.com",
            "name": "Valid User"
        })
        
        assert result.email == "valid@example.com"
        mock_repository.create.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_create_user_invalid_email(self, mock_repository):
        """Debe fallar cuando email es inválido."""
        service = UserService(repository=mock_repository)
        
        with pytest.raises(ValidationError) as exc:
            await service.create({
                "email": "invalid-email",
                "name": "User"
            })
        
        assert "email" in str(exc.value)