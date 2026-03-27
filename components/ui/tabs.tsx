'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type TabsCtx = { value: string; onChange: (v: string) => void }
const TabsContext = React.createContext<TabsCtx | null>(null)

function useTabsCtx() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tabs: debe estar dentro de <Tabs>')
  return ctx
}

type TabsProps = {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={cn('', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg bg-muted p-1 text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: active, onChange } = useTabsCtx()
  const isActive = active === value
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => onChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50 hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: active } = useTabsCtx()
  if (active !== value) return null
  return (
    <div role="tabpanel" className={cn('', className)}>
      {children}
    </div>
  )
}
