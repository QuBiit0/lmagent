from enum import Enum
from functools import wraps

class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    READONLY = "readonly"

def require_role(required_role: Role):
    """Decorator para requerir rol específico."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            if current_user.role != required_role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role {required_role} required"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

@router.delete("/users/{user_id}")
@require_role(Role.ADMIN)
async def delete_user(user_id: int, current_user: User = Depends()):
    """Solo admins pueden eliminar usuarios."""
    pass