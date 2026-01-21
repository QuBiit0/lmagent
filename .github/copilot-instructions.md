# LMAgent Framework - GitHub Copilot Instructions

## Project Context

This project uses the **LMAgent** framework for automation and AI agent development.

## Key Files to Reference

- `AGENTS.md` - Main framework document with levels, rules, and workflows
- `config/settings.yaml` - Framework configuration
- `rules/stack.md` - Technology stack and patterns
- `rules/code-style.md` - Code style guidelines

## Technology Stack

### Python Backend
- FastAPI for web framework
- SQLModel for ORM (combines SQLAlchemy + Pydantic)
- Pydantic for data validation
- Redis for caching
- pytest for testing

### Node.js Backend (when used)
- NestJS or Express
- Prisma for ORM
- Jest for testing

### Database
- PostgreSQL as primary database
- Redis for cache and state

### Infrastructure
- Docker for containerization
- n8n for workflow automation

## Code Patterns

### Python Functions
```python
async def function_name(param: ParamType) -> ReturnType:
    """Brief description of what the function does.
    
    Args:
        param: Description of the parameter.
    
    Returns:
        Description of what is returned.
    """
    pass
```

### API Endpoints (FastAPI)
```python
@router.post("/resource", response_model=ResponseSchema, status_code=201)
async def create_resource(
    data: CreateSchema,
    service: ResourceService = Depends()
) -> ResponseSchema:
    """Creates a new resource."""
    return await service.create(data)
```

### Error Handling
```python
class NotFoundError(Exception):
    """Resource not found."""
    pass

# In router
try:
    result = await service.get(id)
except NotFoundError:
    raise HTTPException(status_code=404, detail="Resource not found")
```

## Code Style Guidelines

1. Always use type hints
2. Write docstrings for public functions
3. Use async/await for I/O operations
4. Handle errors with specific exceptions
5. Use structured logging (not print)
6. Configure via environment variables (pydantic-settings)
7. Write tests for business logic

## Naming Conventions

- Files: `snake_case.py`
- Classes: `PascalCase`
- Functions: `snake_case`
- Constants: `UPPER_SNAKE_CASE`
- Private: prefix with `_`

## Testing

- Write tests for all new business logic
- Target 80%+ coverage
- Use pytest and pytest-asyncio
- Mock external services

## Commit Messages

Format: `type(scope): description`

Types: feat, fix, refactor, docs, test, chore

Examples:
- `feat(users): add email verification`
- `fix(auth): handle expired tokens`
- `refactor(services): extract validation`
