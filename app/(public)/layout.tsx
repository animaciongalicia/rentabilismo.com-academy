import PublicSidebar from '@/components/layout/public-sidebar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <PublicSidebar />
      <main className="flex-1 overflow-y-auto pt-12 md:pt-0 bg-zinc-50">{children}</main>
    </div>
  )
}
