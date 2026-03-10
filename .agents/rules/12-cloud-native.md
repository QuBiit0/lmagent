# ☁️ Cloud Native & DevOps Baseline
> **Tipo**: `rule` | **Versión**: 3.6.0 | **Actualización**: 2026-03

## 📌 Quick Reference

| Principio | Regla |
|-----------|-------|
| **IaC** | Todo recurso definido en código. Nada manual desde consola. |
| **12-Factor** | Apps stateless, config en env vars, logs a stdout. |
| **Docker** | Multi-stage builds siempre. Base alpine o distroless. |
| **Secrets** | `os.getenv()` estricto. Fail-fast si falta variable. |
| **Graceful Shutdown** | Manejar SIGTERM/SIGINT para drenar conexiones. |

### 👥 Roles que usan esta regla
`cloud-architect`, `devops-engineer`, `backend-engineer`, `architect`

---

## 📌 Filosofía 12-Factor App
Todo servicio o API construido bajo el framework LMAgent DEBE apuntar a cumplir con la metodología *12-Factor App*:

1. **Codebase**: Un único repositorio bajo Git, múltiples deployments (Prod, Staging, Dev).
2. **Dependencies**: `package.json` o `requirements.txt` deben declarar *absolutamente todo*. Dependencias de sistema (`apt`) van aisladas en el Dockerfile.
3. **Config**: NUNCA hardcodear credenciales. Usar `os.getenv()` o `process.env` estricto (falla rápido si falta la variable).
4. **Backing Services**: DB, caches, colas deben ser intercambiables vía URL de conexión.
5. **Build/Release/Run**: Separar la compilación del despliegue. Nunca editar código en producción.
6. **Processes**: Stateless. Sin estado local en el servidor web.
7. **Port Binding**: El servicio exporta su puerto. No depende de un runtime externo.
8. **Concurrency**: Escalar mediante procesos horizontales, no hilos verticales.
9. **Disposability**: Fast startup + Graceful shutdown.
10. **Dev/Prod Parity**: Mínimas diferencias entre entornos.
11. **Logs**: Tratar como streams (stdout). No escribir a archivos locales.
12. **Admin Processes**: Comandos administrativos como procesos one-off.

---

## 🐳 Contenedores Eficientes (Docker)

### Multi-Stage Builds
Usar siempre contenedores Multi-stage (*Builder* → *Runtime*) para reducir la superficie de ataque y el tamaño:

```dockerfile
# BUILDER
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# RUNTIME
FROM node:22-alpine
WORKDIR /app
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Best Practices Docker

| Práctica | Detalle |
|:---|:---|
| **No correr como root** | Crear usuario `appuser` con `adduser` |
| **`.dockerignore`** | Siempre incluir `node_modules`, `.git`, `*.md`, `.env` |
| **HEALTHCHECK** | Incluir `HEALTHCHECK CMD curl -f http://localhost:3000/health` |
| **Labels** | Agregar `LABEL maintainer`, `version`, `description` |
| **Capas eficientes** | Copiar `package*.json` ANTES del código para cachear deps |

### Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```python
# FastAPI health endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": os.getenv("APP_VERSION", "unknown")}
```

---

## ⚡ Graceful Shutdown

### Node.js
```javascript
const server = app.listen(PORT);

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    // Cerrar conexiones de DB, Redis, etc.
    process.exit(0);
  });
});
```

### Python (FastAPI)
```python
@app.on_event("shutdown")
async def shutdown_event():
    # Cerrar pools de conexión
    await db_pool.close()
    await redis.close()
```

---

## 📊 Logging Standards (Structured)

### Formato JSON (Recomendado)
```json
{
  "timestamp": "2026-03-10T08:30:00Z",
  "level": "info",
  "service": "api-gateway",
  "message": "Request processed",
  "trace_id": "abc-123",
  "duration_ms": 45,
  "status_code": 200
}
```

### Reglas
1. **stdout/stderr**: Nunca escribir logs a archivos locales.
2. **JSON structured**: Parseable por herramientas de observabilidad.
3. **Sin PII**: Nunca loguear passwords, tokens, datos personales.
4. **Correlation ID**: Propagar `trace_id` entre microservicios.

---

## ⚡ Serverless / Zero Scaling

Si se orquestan despliegues tipo AWS Lambda, Google Cloud Run o Vercel Edge:

1. **Minimizar Cold Start**: Evitar dependencias ultra-pesadas no esenciales.
2. **Tree-Shaking**: Usar bundlers (esbuild, webpack) para reducir tamaño del paquete.
3. **Conexiones Persistentes**: Reutilizar conexiones de DB entre invocaciones (ej: Google Cloud Run).
4. **Timeouts**: Configurar timeout explícito en la función.

---

## ✅ Checklist Cloud Native

```markdown
## Contenedores
- [ ] Multi-stage build implementado
- [ ] No corre como root
- [ ] `.dockerignore` configurado
- [ ] HEALTHCHECK incluido
- [ ] Tamaño de imagen < 200MB

## 12-Factor App
- [ ] Config en variables de entorno (no hardcoded)
- [ ] Stateless (sin estado local)
- [ ] Logs a stdout/stderr (JSON structured)
- [ ] Graceful shutdown (SIGTERM handler)
- [ ] Dependencies declaradas explícitamente

## Seguridad
- [ ] Secrets en Secret Manager (no en imagen)
- [ ] Base image actualizada (sin CVEs conocidos)
- [ ] Escaneo de vulnerabilidades (Trivy/Snyk)
```
