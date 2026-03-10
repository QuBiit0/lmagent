-- Índices que faltan (pg_stat_user_tables)
SELECT 
    relname as table,
    seq_scan,
    idx_scan,
    CASE WHEN seq_scan > 0 
         THEN round(100.0 * idx_scan / (seq_scan + idx_scan), 2)
         ELSE 100 
    END as idx_usage_percent
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_scan DESC;

-- Índices no usados
SELECT
    indexrelname as index,
    idx_scan as times_used
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public';