// ❌ Anti-patrón: any abuse
function processData(data: any): any { ... }

// ✅ Correcto: tipos explícitos
function processData(data: UserInput): ProcessedResult { ... }

// ❌ Anti-patrón: callback hell
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getItems(orders[0].id, (items) => { ... })
  })
})

// ✅ Correcto: async/await
const user = await getUser(id);
const orders = await getOrders(user.id);
const items = await getItems(orders[0].id);

// ❌ Anti-patrón: God component
function Dashboard() { /* 500 líneas... */ }

// ✅ Correcto: composición
function Dashboard() {
  return (
    <DashboardHeader />
    <DashboardMetrics />
    <DashboardTable />
  );
}