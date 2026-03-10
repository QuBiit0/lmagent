// STUB — Retorna datos controlados
const userRepo = {
  findById: vi.fn().mockResolvedValue({ id: '1', name: 'Leo' })
};

// MOCK — Verifica interacciones
const emailService = {
  send: vi.fn()
};
await userService.register(data);
expect(emailService.send).toHaveBeenCalledWith('leo@test.com', expect.any(String));

// SPY — Observa sin reemplazar
const logSpy = vi.spyOn(console, 'log');
processOrder(order);
expect(logSpy).toHaveBeenCalledWith('Order processed:', order.id);

// FAKE — Implementación simplificada
class InMemoryUserRepo implements UserRepository {
  private users: Map<string, User> = new Map();
  
  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
  
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
}