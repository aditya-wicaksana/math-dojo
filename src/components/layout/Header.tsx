import { useStore } from '../../store/StoreContext'

interface HeaderProps {
  title?: string
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

const AVATARS = ['🐱', '🐶', '🐸', '🦊', '🐼', '🐨', '🦁', '🐯', '🦄', '🤖', '👾', '🦋']

export function Header({ title, onProfileClick, onSettingsClick }: HeaderProps) {
  const { store } = useStore()
  const activeProfile = store.profiles.find(p => p.id === store.activeProfileId)

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥋</span>
          <span className="font-black text-primary-400 text-xl tracking-tight">
            Math Dojo
          </span>
        </div>

        {/* Screen title (tablet+) */}
        {title && (
          <h1 className="hidden sm:block text-lg font-bold text-gray-700">{title}</h1>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {activeProfile && (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-1.5 bg-secondary-50 hover:bg-secondary-100 px-3 py-1.5 rounded-full transition-colors touch-target"
            >
              <span className="text-xl">{AVATARS[activeProfile.avatarIndex]}</span>
              <span className="font-bold text-sm text-secondary-700 max-w-[80px] truncate hidden xs:block">
                {activeProfile.name}
              </span>
            </button>
          )}
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-xl touch-target"
              aria-label="Settings"
            >
              ⚙️
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
