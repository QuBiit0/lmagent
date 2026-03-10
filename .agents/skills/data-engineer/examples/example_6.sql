-- ✅ Agregar columna nullable (no lock)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- ❌ PELIGROSO: Agregar columna NOT NULL sin default
-- Causa lock de tabla completa
ALTER TABLE users ADD COLUMN required_field VARCHAR(20) NOT NULL;

-- ✅ SEGURO: En pasos
ALTER TABLE users ADD COLUMN required_field VARCHAR(20);
UPDATE users SET required_field = 'default' WHERE required_field IS NULL;
ALTER TABLE users ALTER COLUMN required_field SET NOT NULL;

-- ✅ Crear índice sin bloqueo
CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone);

-- ⚠️ Renombrar columna (requiere cambios en app)
ALTER TABLE users RENAME COLUMN old_name TO new_name;