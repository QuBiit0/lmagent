import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session
from app.main import app
from app.core.database import engine

@pytest.fixture
async def client():
    """Cliente HTTP para tests de API."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def db_session():
    """Sesión de base de datos para tests."""
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def user_factory():
    """Factory para crear usuarios de prueba."""
    def _create_user(**kwargs):
        defaults = {
            "email": f"test_{uuid4()}@example.com",
            "name": "Test User"
        }
        defaults.update(kwargs)
        return User(**defaults)
    return _create_user