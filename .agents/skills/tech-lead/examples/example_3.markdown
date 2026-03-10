## Checklist de Code Review

### Correctness
- [ ] ¿El código hace lo que dice que hace?
- [ ] ¿Maneja edge cases?
- [ ] ¿Hay bugs obvios?

### Design
- [ ] ¿El diseño es simple y claro?
- [ ] ¿Sigue los patrones del proyecto?
- [ ] ¿Es extensible donde necesita serlo?
- [ ] ¿Hay acoplamiento innecesario?

### Readability
- [ ] ¿Se entiende sin explicación?
- [ ] ¿Los nombres son descriptivos?
- [ ] ¿Los comentarios son necesarios y útiles?

### Performance
- [ ] ¿Hay N+1 queries?
- [ ] ¿Hay operaciones O(n²) evitables?
- [ ] ¿Se usa caching donde corresponde?

### Testing
- [ ] ¿Hay tests suficientes?
- [ ] ¿Los tests son legibles?
- [ ] ¿Cubren casos de error?

### Security
- [ ] ¿Se validan inputs?
- [ ] ¿Hay exposición de datos sensibles?
- [ ] ¿Se siguen prácticas de auth/authz?