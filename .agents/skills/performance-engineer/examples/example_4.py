import redis
import json
from functools import wraps
from typing import Any, Callable

redis_client = redis.Redis(host='localhost', port=6379)

# Pattern 1: Cache-Aside
def cache_aside(key: str, ttl: int = 3600):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Try cache first
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            
            # Cache miss - get from source
            result = await func(*args, **kwargs)
            
            # Store in cache
            redis_client.setex(key, ttl, json.dumps(result))
            
            return result
        return wrapper
    return decorator

# Pattern 2: Write-Through
async def save_user(user_id: str, data: dict):
    # Write to DB
    await db.update_user(user_id, data)
    
    # Update cache
    redis_client.setex(f"user:{user_id}", 3600, json.dumps(data))

# Pattern 3: Cache Invalidation
async def invalidate_user_cache(user_id: str):
    # Delete specific key
    redis_client.delete(f"user:{user_id}")
    
    # Delete related keys
    keys = redis_client.keys(f"user:{user_id}:*")
    if keys:
        redis_client.delete(*keys)

# Pattern 4: Stampede Protection
from redis.lock import Lock

async def get_with_lock(key: str, fetch_func: Callable):
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)
    
    lock = Lock(redis_client, f"lock:{key}", timeout=10)
    
    if lock.acquire(blocking=True, blocking_timeout=5):
        try:
            # Double-check cache
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            
            # Fetch and cache
            result = await fetch_func()
            redis_client.setex(key, 3600, json.dumps(result))
            return result
        finally:
            lock.release()