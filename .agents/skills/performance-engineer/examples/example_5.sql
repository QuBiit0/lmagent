-- PostgreSQL: EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.status = 'active'
GROUP BY u.id
ORDER BY order_count DESC
LIMIT 10;

-- Buscar:
-- ✅ Index Scan = Bueno
-- ❌ Seq Scan en tablas grandes = Malo
-- ❌ Sort con alto cost = Necesita índice
-- ❌ Hash Join con muchas rows = Revisar