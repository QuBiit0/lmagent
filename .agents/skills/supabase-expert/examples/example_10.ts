// ✅ Select solo lo necesario (no select *)
const { data } = await supabase
  .from('users')
  .select('id, name, email, role')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .range(0, 19); // Pagination: first 20

// ✅ Joins eficientes
const { data } = await supabase
  .from('orders')
  .select(`
    id, total, status,
    user:users(name, email),
    items:order_items(product_name, quantity, price)
  `)
  .eq('status', 'pending');

// ❌ Anti-pattern: N+1 queries
for (const order of orders) {
  const { data } = await supabase.from('items').select('*').eq('order_id', order.id);
}

// ✅ Correcto: batch query
const { data } = await supabase
  .from('items')
  .select('*')
  .in('order_id', orders.map(o => o.id));