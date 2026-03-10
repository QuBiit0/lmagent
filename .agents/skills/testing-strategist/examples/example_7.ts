// ❌ Test que testea la implementación, no el comportamiento
it('should call repository.save', async () => {
  await service.create(data);
  expect(repo.save).toHaveBeenCalled(); // Frágil — se rompe con refactor
});

// ✅ Test que testea el resultado
it('should persist the user', async () => {
  const user = await service.create(data);
  const found = await repo.findById(user.id);
  expect(found).toEqual(user); // Resistente a refactors
});

// ❌ Test sin assertions claras
it('should work', async () => {
  const result = await process(data);
  expect(result).toBeTruthy(); // ¿Qué es "truthy"?
});

// ✅ Assertions específicas
it('should return processed order with calculated tax', async () => {
  const result = await process(orderData);
  expect(result.total).toBe(242);
  expect(result.tax).toBe(42);
  expect(result.status).toBe('processed');
});

// ❌ Test flaky con timing
it('should debounce search', async () => {
  search('hello');
  await new Promise(r => setTimeout(r, 500)); // ❌ Flaky
  expect(results).toHaveLength(5);
});

// ✅ Test determinístico
it('should debounce search', async () => {
  vi.useFakeTimers();
  search('hello');
  vi.advanceTimersByTime(300);
  expect(apiCall).not.toHaveBeenCalled();
  vi.advanceTimersByTime(200);
  expect(apiCall).toHaveBeenCalledOnce();
  vi.useRealTimers();
});