import AppHeader from '@/components/layout/app-header'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  )
}
