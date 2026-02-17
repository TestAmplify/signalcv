import { AppSidebar } from '@/components/app-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-canvas">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
