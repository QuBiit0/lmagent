---
description: Workflow para crear una nueva migración de base de datos
---

# Database Migration Workflow

Usa este workflow para crear y aplicar migraciones de BD.

## 1. Planificar el Cambio

- ¿Qué tabla(s) afecta?
- ¿Es reversible?
- ¿Es breaking change?

## 2. Crear la Migración

### Con Alembic (Python)
```bash
alembic revision -m "add_users_table"
```

### Con Prisma (TypeScript)
```bash
npx prisma migrate dev --name add_users_table
```

### SQL Manual
```bash
touch migrations/$(date +%Y%m%d%H%M)_add_users_table.sql
```

## 3. Escribir la Migración

### Template SQL
```sql
-- migrations/20240121_add_users_table.sql

BEGIN;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

COMMIT;
```

## 4. Prácticas Seguras

✅ **SEGURO** (sin lock):
- `ADD COLUMN` nullable
- `CREATE INDEX CONCURRENTLY`
- `DROP INDEX`

⚠️ **CUIDADO** (puede bloquear):
- `ADD COLUMN NOT NULL` sin default
- `ALTER COLUMN TYPE`
- `ADD CONSTRAINT`

❌ **PELIGROSO**:
- `DROP TABLE` sin backup
- `DELETE` sin WHERE

## 5. Probar Localmente

```bash
# Aplicar migración
alembic upgrade head  # o prisma migrate dev

# Verificar
psql -c "\\d users"
```

## 6. Aplicar en Staging

```bash
# Backup primero
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Aplicar
alembic upgrade head
```

## 7. Aplicar en Producción

- [ ] Backup completado
- [ ] Staging probado
- [ ] Ventana de mantenimiento (si aplica)
- [ ] Rollback plan listo

## Rollback

```bash
# Alembic
alembic downgrade -1

# O restaurar backup
psql $DATABASE_URL < backup.sql
```

Para más detalles ver `@/personas/data-engineer.md`
