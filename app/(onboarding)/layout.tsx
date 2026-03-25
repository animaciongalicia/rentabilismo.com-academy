export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex justify-center pt-8 pb-4">
        <span className="text-xl font-bold tracking-tight">
          Rentabilismo<span className="text-primary">.</span>
        </span>
      </header>
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        {children}
      </main>
    </div>
  )
}
