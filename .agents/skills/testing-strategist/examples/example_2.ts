// test/users.test.ts
describe('UserService.create', () => {
  it('should create a user with valid data', async () => {
    const userData = { name: 'Leo', email: 'leo@test.com' };
    
    const user = await userService.create(userData);
    
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Leo');
    expect(user.email).toBe('leo@test.com');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should reject duplicate email', async () => {
    const userData = { name: 'Leo', email: 'leo@test.com' };
    await userService.create(userData);
    
    await expect(userService.create(userData))
      .rejects.toThrow('Email already registered');
  });

  it('should require a valid email format', async () => {
    const userData = { name: 'Leo', email: 'not-an-email' };
    
    await expect(userService.create(userData))
      .rejects.toThrow('Invalid email format');
  });
});