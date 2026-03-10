// factories/user.factory.ts
function createUser(overrides: Partial<User> = {}): User {
  return {
    id: `usr_${Math.random().toString(36).substr(2)}`,
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    role: 'user',
    createdAt: new Date(),
    ...overrides,
  };
}

// Uso en tests
it('should deny access for non-admin users', async () => {
  const user = createUser({ role: 'viewer' });
  const result = await accessControl.canDelete(user, someResource);
  expect(result).toBe(false);
});