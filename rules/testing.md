# LMAgent Testing Rules

Este documento define las reglas y estándares de testing del framework.

## 📊 Objetivos de Cobertura

| Tipo de Código | Cobertura Mínima |
|----------------|------------------|
| Lógica de negocio | 90% |
| Endpoints API | 85% |
| Componentes UI | 75% |
| Utilidades | 80% |
| **Total Proyecto** | **80%** |

---

## Estructura de Tests

### Python

```
tests/
├── unit/                 # Tests aislados
│   ├── test_utils.py
│   └── test_services.py
├── integration/          # Tests con DB/APIs
│   ├── test_users_api.py
│   └── test_auth_flow.py
├── e2e/                  # Tests end-to-end
│   └── test_user_journey.py
├── fixtures/             # Test data
│   └── users.json
└── conftest.py           # Fixtures compartidos
```

### TypeScript

```
src/
├── __tests__/            # Unit tests
│   └── utils.test.ts
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx  # Co-located
e2e/
├── login.spec.ts         # Playwright
└── checkout.spec.ts
```

---

## Naming Conventions

### Nombres de Tests

```python
# Formato: test_{what}_{condition}_{expected}
def test_calculate_discount_with_percentage_returns_reduced_price():
def test_create_user_with_duplicate_email_raises_conflict():
def test_login_with_invalid_password_returns_401():
```

### Archivos de Test

```
# Python
test_{module}.py

# TypeScript  
{Component}.test.tsx
{module}.test.ts
```

---

## Patrones de Testing

### Arrange-Act-Assert (AAA)

```python
def test_user_creation():
    # Arrange
    user_data = {"email": "test@example.com", "name": "Test"}
    
    # Act
    result = create_user(user_data)
    
    # Assert
    assert result.email == "test@example.com"
    assert result.id is not None
```

### Given-When-Then (BDD)

```python
def test_discount_application():
    # Given a cart with items totaling $100
    cart = Cart(total=Decimal("100"))
    
    # When a 20% discount is applied
    cart.apply_discount(percentage=20)
    
    # Then the total should be $80
    assert cart.total == Decimal("80")
```

---

## Fixtures y Factories

### pytest Fixtures

```python
# conftest.py
@pytest.fixture
def sample_user() -> User:
    return User(
        id=uuid4(),
        email="test@example.com",
        name="Test User"
    )

@pytest.fixture
async def authenticated_client(client, sample_user):
    token = create_access_token(sample_user)
    client.headers["Authorization"] = f"Bearer {token}"
    return client
```

### Factories

```python
# tests/factories.py
import factory
from faker import Faker

fake = Faker()

class UserFactory(factory.Factory):
    class Meta:
        model = User
    
    id = factory.LazyFunction(uuid4)
    email = factory.LazyAttribute(lambda _: fake.email())
    name = factory.LazyAttribute(lambda _: fake.name())
    created_at = factory.LazyFunction(datetime.utcnow)
```

---

## Mocking

### Cuándo Mockear

- ✅ APIs externas
- ✅ Servicios de terceros
- ✅ Operaciones de I/O costosas
- ✅ Tiempo/fecha
- ❌ La base de datos en integration tests
- ❌ Código interno (salvo excepciones)

### Python (unittest.mock)

```python
from unittest.mock import patch, AsyncMock

@patch("app.services.email.send_email")
async def test_user_registration_sends_email(mock_send):
    mock_send.return_value = AsyncMock()
    
    await register_user({"email": "test@example.com"})
    
    mock_send.assert_called_once_with(
        to="test@example.com",
        subject="Welcome!"
    )
```

### HTTP Mocking (respx)

```python
import respx
import httpx

@respx.mock
async def test_external_api_call():
    respx.get("https://api.external.com/data").mock(
        return_value=httpx.Response(200, json={"key": "value"})
    )
    
    result = await fetch_external_data()
    
    assert result["key"] == "value"
```

---

## Testing Async Code

```python
import pytest

@pytest.mark.asyncio
async def test_async_function():
    result = await async_operation()
    assert result is not None
```

---

## Testing Exceptions

```python
import pytest

def test_invalid_input_raises_error():
    with pytest.raises(ValueError, match="must be positive"):
        calculate_price(-10)

async def test_not_found_raises_404():
    with pytest.raises(HTTPException) as exc_info:
        await get_user("nonexistent")
    
    assert exc_info.value.status_code == 404
```

---

## Test Performance

### Markers para Tests Lentos

```python
@pytest.mark.slow
def test_large_data_processing():
    # Test que tarda más de 1 segundo
    ...

# pytest.ini
[pytest]
markers =
    slow: marks tests as slow
```

### Ejecutar Excluyendo Lentos

```bash
pytest -m "not slow"
```

---

## CI Integration

```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    
    - name: Run tests
      run: pytest --cov=app --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v4
```

---

## Anti-Patterns a Evitar

```markdown
❌ Tests que dependen del orden de ejecución
❌ Tests que acceden a estado global
❌ Tests que no limpian después de ejecutar
❌ Tests demasiado grandes (>30 líneas)
❌ Tests sin assertions
❌ Mockear todo (tests frágiles)
❌ Tests que dependen de la hora real
❌ Ignorar tests intermitentes
```

---

## Checklist de Testing

```markdown
## Antes de Push
- [ ] Tests unitarios para nueva lógica
- [ ] Tests de integración para endpoints
- [ ] Coverage no disminuyó
- [ ] No hay tests skipped sin razón
- [ ] Tests locales pasan

## Para Bugs
- [ ] Test que reproduce el bug (falla primero)
- [ ] Fix implementado
- [ ] Test ahora pasa
- [ ] Otros tests no rompieron
```
