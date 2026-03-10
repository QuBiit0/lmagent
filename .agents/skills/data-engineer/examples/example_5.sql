-- migrations/20240121_add_orders_table.sql

-- Up Migration
BEGIN;

-- 1. Verificar idempotencia
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        RAISE EXCEPTION 'Table orders already exists';
    END IF;
END $$;

-- 2. Crear tabla
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear índices
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- 4. Registrar migración
INSERT INTO _migrations (name, applied_at) 
VALUES ('20240121_add_orders_table', NOW());

COMMIT;

-- Down Migration (en archivo separado o comentado)
-- DROP TABLE orders;