# 🏎️ Performance & Scalability Baseline
> **Tipo**: `rule` | **Versión**: 3.6.0 | **Actualización**: 2026-03

Ningún código generado por LMAgent debe degradar la performance del sistema.

## 📌 Principios Core

1. **Asincronía Inquebrantable**: 
   - Prohibido código síncrono bloqueante (ej: `requests`, `fs.readFileSync()`) en loops de eventos asíncronos (Node.js / FastAPI). 
   - Maximiza concurrencia con `asyncio.gather()` o `Promise.all()` en llamadas I/O independientes.

2. **Complejidad Algorítmica (Big-O)**:
   - Apunta a **O(1)** y **O(n)**. 
   - Extrema precaución con **O(n²)** (loops anidados); usa HashMaps/Diccionarios (`O(1)`) para correlacionar datos en memoria.

3. **Bases de Datos & Query Optimization**:
   - **N+1 Queries**: Prohibido hacer queries dentro de un loop. Usa Eager Loading explicitamente (`JOINs`, `selectinload()`, `include`).
   - **Índices**: Columnas usadas frecuentemente en `WHERE`, `JOIN` (Foreign Keys), o `ORDER BY` deben mandatoriamente llevar índices.
   - **Paginación Obligatoria**: Todo endpoint que devuelva listas debe estar paginado (`LIMIT`/`OFFSET`).

4. **Patrones de Caché**:
   - Usar patrón **Cache-Aside** con Redis u análogo para datos de lectura frecuente.
   - **Invalidación estricta**: Invalida siempre la caché en la escritura de los mismos datos.
   - Aplica TTLs cortos (minutos) a datos dinámicos, y largos (horas) a catálogos fijos.

## 📊 SLA Targets
- **Response Time**: P95 < 200ms
- **DB Query**: < 50ms
- **Error Rate**: < 0.1%
- [ ] Profiling necesario en caso de cuellos de botella detectados.
