export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tenant Admin</h1>
      <p className="text-muted">Manage your team's usage and settings.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-xl border border-default">
          <h3 className="text-sm font-medium text-muted">Daily Usage</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">12</span>
            <span className="text-muted">/ 25</span>
          </div>
          <div className="mt-4 w-full h-2 bg-bg-canvas rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
