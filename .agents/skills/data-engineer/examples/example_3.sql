-- 1. Índices para filtros frecuentes
CREATE INDEX idx_orders_status ON orders(status);

-- 2. Índice compuesto para múltiples columnas
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- 3. Índice parcial para subconjuntos
CREATE INDEX idx_orders_pending ON orders(created_at) 
WHERE status = 'pending';

-- 4. Índice para ordenamiento
CREATE INDEX idx_orders_created_desc ON orders(created_at DESC);

-- 5. Índice para búsqueda full-text
CREATE INDEX idx_products_search ON products 
USING GIN (to_tsvector('spanish', name || ' ' || description));

-- 6. Índice para JSONB
CREATE INDEX idx_orders_metadata ON orders 
USING GIN (metadata);