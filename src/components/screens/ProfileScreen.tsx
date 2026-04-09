import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import type { UserProfile } from '../../store/types'

const AVATARS = ['🐱', '🐶', '🐸', '🦊', '🐼', '🐨', '🦁', '🐯', '🦄', '🤖', '👾', '🦋']

interface ProfileScreenProps {
  profileId?: string          // if provided → edit mode
  onSave: () => void
  onCancel: () => void
}

export function ProfileScreen({ profileId, onSave, onCancel }: ProfileScreenProps) {
  const { t } = useLocale()
  const { store, createProfile, updateProfile, deleteProfile } = useStore()
  const existing = profileId ? store.profiles.find(p => p.id === profileId) : undefined

  const [name, setName] = useState(existing?.name ?? '')
  const [avatar, setAvatar] = useState(existing?.avatarIndex ?? 0)
  const [grade, setGrade] = useState<UserProfile['grade']>(existing?.grade ?? 1)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) { setError(t('profile.nameRequired')); return }
    if (trimmed.length > 16) { setError(t('profile.nameTooLong')); return }
    if (existing && profileId) {
      updateProfile(profileId, { name: trimmed, avatarIndex: avatar, grade })
    } else {
      createProfile(trimmed, avatar, grade)
    }
    onSave()
  }

  const handleDelete = () => {
    if (profileId) {
      deleteProfile(profileId)
      onSave()
    }
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-black text-gray-800">
        {existing ? t('profile.edit') : t('profile.create')}
      </h2>

      {/* Avatar Picker */}
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">
          {t('profile.avatarLabel')}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((av, i) => (
            <button
              key={i}
              onClick={() => setAvatar(i)}
              className={[
                'text-2xl w-10 h-10 rounded-2xl flex items-center justify-center transition-all',
                avatar === i
                  ? 'bg-primary-100 ring-2 ring-primary-400 scale-110'
                  : 'bg-gray-50 hover:bg-gray-100',
              ].join(' ')}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-1">
          {t('profile.nameLabel')}
        </label>
        <input
          type="text"
          maxLength={16}
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          placeholder={t('profile.namePlaceholder')}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-2.5 text-base font-semibold text-gray-800 focus:border-primary-400 focus:outline-none transition-colors"
        />
        {error && <p className="text-red-500 text-xs font-semibold mt-1">{error}</p>}
      </div>

      {/* Grade */}
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">
          {t('profile.gradeLabel')}
        </label>
        <div className="flex gap-2 flex-wrap">
          {([1, 2, 3, 4, 5, 6] as const).map(g => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={[
                'px-4 py-2 rounded-2xl font-bold text-sm transition-all',
                grade === g
                  ? 'bg-primary-400 text-white scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ].join(' ')}
            >
              {t('profile.grade', { n: g })}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          {t('profile.cancel')}
        </Button>
        <Button variant="primary" onClick={handleSave} className="flex-1">
          {t('profile.save')}
        </Button>
      </div>

      {existing && (
        <>
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            fullWidth
            size="sm"
          >
            🗑️ {t('profile.delete')}
          </Button>
          <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-gray-700 font-semibold text-center">
                {t('profile.deleteConfirm', { name: existing.name })}
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  {t('profile.cancel')}
                </Button>
                <Button variant="danger" onClick={handleDelete} className="flex-1">
                  {t('profile.delete')}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
