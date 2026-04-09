import type { ReactNode } from 'react'
import { Header } from './Header'
import { BottomNav, type NavTab } from './BottomNav'

interface AppShellProps {
  children: ReactNode
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  hideNav?: boolean
  headerTitle?: string
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

export function AppShell({
  children,
  activeTab,
  onTabChange,
  hideNav = false,
  headerTitle,
  onProfileClick,
  onSettingsClick,
}: AppShellProps) {
  return (
    <div className="flex flex-col min-h-dvh font-nunito">
      <Header
        title={headerTitle}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
      />
      <main className={`flex-1 max-w-4xl w-full mx-auto px-4 py-4 ${hideNav ? '' : 'pb-24 md:pb-6'}`}>
        {children}
      </main>
      {!hideNav && (
        <BottomNav activeTab={activeTab} onChange={onTabChange} />
      )}
    </div>
  )
}
