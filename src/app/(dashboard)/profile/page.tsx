import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, tenant_id, created_at')
    .eq('id', user?.id)
    .maybeSingle()

  const { data: tenant } = profile
    ? await supabase
        .from('tenants')
        .select('name, created_at')
        .eq('id', profile.tenant_id)
        .maybeSingle()
    : { data: null }

  return (
    <div className="space-y-8 max-w-xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted text-sm">View basic account details for your SignalCV workspace.</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-default bg-surface p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted">Account</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Email</span>
              <span className="font-medium text-primary">{user?.email ?? 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">User ID</span>
              <span className="font-mono text-xs text-muted">{user?.id ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Joined</span>
              <span className="text-sm text-primary">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-default bg-surface p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted">Workspace</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Tenant name</span>
              <span className="font-medium text-primary">{tenant?.name ?? 'Personal workspace'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Role</span>
              <span className="font-medium text-primary">
                {profile?.role ? profile.role.replace('_', ' ') : 'user'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Member since</span>
              <span className="text-sm text-primary">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

