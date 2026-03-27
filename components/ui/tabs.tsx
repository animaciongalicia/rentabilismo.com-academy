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
        'flex items-stretch border-b border-border overflow-x-auto scrollbar-none',
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
        'shrink-0 inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'font-semibold text-foreground border-b-2 border-primary -mb-px'
          : 'font-medium text-muted-foreground/70 hover:text-foreground border-b-2 border-transparent -mb-px',
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
