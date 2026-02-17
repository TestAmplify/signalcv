export default function SuperAdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Global Admin</h1>
      <p className="text-muted">Manage all tenants and system settings.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-xl border border-default">
          <h3 className="text-sm font-medium text-muted">Total Tenants</h3>
          <p className="mt-2 text-3xl font-bold">1</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-default">
          <h3 className="text-sm font-medium text-muted">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">1</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-default">
          <h3 className="text-sm font-medium text-muted">Global Usage</h3>
          <p className="mt-2 text-3xl font-bold">12 / 1000</p>
        </div>
      </div>
    </div>
  )
}
