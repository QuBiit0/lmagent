# Backup completo diario
pg_dump -Fc -U postgres mydb > backup_$(date +%Y%m%d).dump

# Backup incremental con WAL archiving
# postgresql.conf
archive_mode = on
archive_command = 'cp %p /path/to/wal_archive/%f'

# Script de backup automatizado
#!/bin/bash
BACKUP_DIR="/backups"
DB_NAME="mydb"
RETENTION_DAYS=30

# Crear backup
pg_dump -Fc -U postgres $DB_NAME > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M).dump

# Limpiar backups antiguos
find $BACKUP_DIR -name "backup_*.dump" -mtime +$RETENTION_DAYS -delete