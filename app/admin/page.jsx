export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-black p-6 rounded">Total Sales</div>
        <div className="bg-black p-6 rounded">Orders</div>
        <div className="bg-black p-6 rounded">Users</div>
      </div>
    </div>
  );
}