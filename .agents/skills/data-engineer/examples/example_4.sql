-- ✅ BUENO: Usar índices
SELECT * FROM orders 
WHERE user_id = $1 
  AND status = 'completed'
ORDER BY created_at DESC
LIMIT 10;

-- ❌ MALO: Funciones sobre columnas indexadas
SELECT * FROM users 
WHERE LOWER(email) = 'test@example.com';

-- ✅ MEJOR: Índice expression o dato ya normalizado
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- ❌ MALO: SELECT *
SELECT * FROM orders WHERE user_id = $1;

-- ✅ MEJOR: Solo columnas necesarias
SELECT id, status, total, created_at 
FROM orders WHERE user_id = $1;

-- ❌ MALO: N+1 queries
FOR user IN users:
    SELECT * FROM orders WHERE user_id = user.id

-- ✅ MEJOR: JOIN o subquery
SELECT u.*, array_agg(o.*) as orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;