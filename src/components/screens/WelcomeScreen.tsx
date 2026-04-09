import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { ProfileScreen } from './ProfileScreen'

const AVATARS = ['🐱', '🐶', '🐸', '🦊', '🐼', '🐨', '🦁', '🐯', '🦄', '🤖', '👾', '🦋']

interface WelcomeScreenProps {
  onProfileSelected: () => void
}

export function WelcomeScreen({ onProfileSelected }: WelcomeScreenProps) {
  const { t } = useLocale()
  const { store, setActiveProfile } = useStore()
  const [showCreate, setShowCreate] = useState(false)

  const handleSelect = (id: string) => {
    setActiveProfile(id)
    onProfileSelected()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="text-7xl mb-4 animate-pulse-soft">🥋</div>
        <h1 className="text-4xl sm:text-5xl font-black text-primary-400 mb-2">
          {t('app.title')}
        </h1>
        <p className="text-lg font-semibold text-gray-500">{t('app.tagline')}</p>
      </div>

      {/* Profiles */}
      <div className="w-full max-w-md">
        <h2 className="text-center text-xl font-bold text-gray-700 mb-4">
          {t('welcome.chooseNinja')}
        </h2>

        {store.profiles.length === 0 ? (
          <div className="text-center py-8 bg-white/60 rounded-3xl">
            <p className="text-5xl mb-3">🥷</p>
            <p className="font-bold text-gray-500">{t('welcome.noProfiles')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('welcome.noProfilesHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {store.profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => handleSelect(profile.id)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl shadow-md hover:shadow-lg active:scale-95 transition-all touch-target"
              >
                <span className="text-4xl">{AVATARS[profile.avatarIndex]}</span>
                <span className="font-bold text-gray-800 text-sm truncate max-w-full">
                  {profile.name}
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  {t('profile.grade', { n: profile.grade })}
                </span>
              </button>
            ))}
          </div>
        )}

        <Button
          onClick={() => setShowCreate(true)}
          fullWidth
          size="lg"
          variant="primary"
          className="mt-2"
        >
          ✨ {t('welcome.newNinja')}
        </Button>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <ProfileScreen
          onSave={() => {
            setShowCreate(false)
            onProfileSelected()
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  )
}
