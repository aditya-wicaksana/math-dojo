import { useLocale } from '../../i18n'

export type NavTab = 'home' | 'practice' | 'achievements' | 'settings'

interface BottomNavProps {
  activeTab: NavTab
  onChange: (tab: NavTab) => void
}

const TABS: Array<{ id: NavTab; emoji: string; key: string }> = [
  { id: 'home',         emoji: '🏠', key: 'nav.home'         },
  { id: 'practice',    emoji: '✏️', key: 'nav.practice'    },
  { id: 'achievements',emoji: '🏆', key: 'nav.achievements' },
  { id: 'settings',    emoji: '⚙️', key: 'nav.settings'    },
]

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const { t } = useLocale()
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
      <div className="flex items-stretch">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors touch-target',
              activeTab === tab.id
                ? 'text-primary-500'
                : 'text-gray-400 hover:text-gray-600',
            ].join(' ')}
          >
            <span className="text-xl">{tab.emoji}</span>
            <span className="text-[10px] font-bold">{t(tab.key)}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
