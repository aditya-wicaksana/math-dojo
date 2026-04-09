import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { defaultStore, saveStore } from '../../store/storage'
import type { UserProfile } from '../../store/types'

const APP_VERSION = '1.0.0'

interface SettingsScreenProps {
  onSwitchProfile: () => void
}

export function SettingsScreen({ onSwitchProfile }: SettingsScreenProps) {
  const { t } = useLocale()
  const { store, setLocale, updateProfile } = useStore()
  const profile = store.profiles.find(p => p.id === store.activeProfileId)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    saveStore(defaultStore())
    window.location.reload()
  }

  const handleGradeChange = (grade: UserProfile['grade']) => {
    if (profile) updateProfile(profile.id, { grade })
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-2xl font-black text-gray-800">{t('settings.title')}</h2>

      {/* Language */}
      <div className="bg-white rounded-3xl p-4 shadow-md">
        <p className="font-bold text-gray-700 mb-3">{t('settings.language')}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setLocale('en')}
            className={[
              'flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all',
              store.locale === 'en'
                ? 'bg-primary-400 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ].join(' ')}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => setLocale('id')}
            className={[
              'flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all',
              store.locale === 'id'
                ? 'bg-primary-400 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ].join(' ')}
          >
            🇮🇩 Bahasa
          </button>
        </div>
      </div>

      {/* Grade */}
      {profile && (
        <div className="bg-white rounded-3xl p-4 shadow-md">
          <p className="font-bold text-gray-700 mb-3">{t('settings.gradeOverride')}</p>
          <div className="flex gap-2 flex-wrap">
            {([1, 2, 3, 4, 5, 6] as const).map(g => (
              <button
                key={g}
                onClick={() => handleGradeChange(g)}
                className={[
                  'px-4 py-2 rounded-2xl font-bold text-sm transition-all',
                  profile.grade === g
                    ? 'bg-secondary-400 text-white scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ].join(' ')}
              >
                {t('profile.grade', { n: g })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile actions */}
      <div className="bg-white rounded-3xl p-4 shadow-md flex flex-col gap-2">
        <Button variant="secondary" fullWidth onClick={onSwitchProfile}>
          🥷 {t('settings.backToProfiles')}
        </Button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-3xl p-4 shadow-md">
        <p className="font-bold text-gray-700 mb-3">⚠️ Danger Zone</p>
        <Button
          variant="danger"
          fullWidth
          onClick={() => setShowResetConfirm(true)}
        >
          🗑️ {t('settings.resetData')}
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400">
        {t('settings.version')} {APP_VERSION}
      </p>

      <Modal open={showResetConfirm} onClose={() => setShowResetConfirm(false)}>
        <div className="p-6 flex flex-col gap-4">
          <p className="text-center text-2xl">⚠️</p>
          <p className="text-gray-700 font-semibold text-center">
            {t('settings.resetConfirm')}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowResetConfirm(false)}
              className="flex-1"
            >
              {t('profile.cancel')}
            </Button>
            <Button variant="danger" onClick={handleReset} className="flex-1">
              {t('settings.resetData')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
