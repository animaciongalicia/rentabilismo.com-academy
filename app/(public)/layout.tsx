import PublicSidebar from '@/components/layout/public-sidebar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <PublicSidebar />
      <main className="flex-1 overflow-y-auto pt-12 md:pt-0">{children}</main>
    </div>
  )
}
