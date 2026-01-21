---
description: Workflow para hacer deploy a producción
---

# Deploy Workflow

Usa este workflow para deployar a producción de forma segura.

## Pre-Deploy Checklist

1. **Verificar rama**
   ```bash
   git branch --show-current  # Debe ser main
   ```

2. **Verificar tests**
   ```bash
   pytest  # O npm test
   ```

3. **Verificar build**
   ```bash
   docker build -t app:latest .
   ```

4. **Revisar changelog**
   - [ ] Versión actualizada
   - [ ] CHANGELOG.md actualizado

## Deploy Steps

5. **Tag de versión**
   ```bash
   git tag v1.x.x
   git push origin v1.x.x
   ```

6. **Deploy (según plataforma)**
   
   ### Dokploy
   ```bash
   # Push a rama de deploy o trigger webhook
   curl -X POST $DEPLOY_WEBHOOK
   ```

   ### Docker manual
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Post-Deploy

7. **Verificar health**
   ```bash
   curl https://api.example.com/health
   ```

8. **Monitorear logs** (primeros 5 min)
   ```bash
   docker logs -f app --since 5m
   ```

9. **Verificar métricas**
   - Error rate normal
   - Latencia normal
   - No crashes

## Rollback (si hay problemas)

```bash
# Volver a versión anterior
git checkout v1.x.x-1
docker-compose up -d
```

Para más detalles ver `@/personas/devops-engineer.md`
