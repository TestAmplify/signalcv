import { SupabaseClient } from '@supabase/supabase-js'

export async function ensureProfile(supabase: SupabaseClient, user: { id: string; email?: string }) {
  // Try to get profile first
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, tenant_id')
    .eq('id', user.id)
    .maybeSingle()

  if (profile) return profile

  // Call the RPC function to create profile and tenant securely
  // This bypasses RLS issues for the "chicken-and-egg" creation problem
  const { data: newProfile, error } = await supabase.rpc('create_own_profile')

  if (error) {
    console.error('Error creating profile via RPC:', error)
    // Fallback: If RPC doesn't exist yet, try manual creation (will fail if RLS is strict)
    try {
      return await createProfileManual(supabase, user)
    } catch (e: any) {
      // Re-throw the manual error but include the RPC error message too for debugging
      throw new Error(`Failed to create profile via RPC (${error.message}) AND manual fallback (${e.message})`)
    }
  }

  return newProfile
}

async function createProfileManual(supabase: SupabaseClient, user: { id: string; email?: string }) {
  const tenantName = user.email ? `${user.email}'s Tenant` : `User ${user.id} Tenant`
  
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({ name: tenantName })
    .select('id')
    .single()

  if (tenantError) {
    throw new Error(`Failed to create tenant: ${tenantError.message}`)
  }

  const { data: newProfile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      tenant_id: tenant.id,
      role: 'user',
    })
    .select('id, tenant_id')
    .single()

  if (profileError) {
    throw new Error(`Failed to create profile: ${profileError.message}`)
  }

  return newProfile
}
