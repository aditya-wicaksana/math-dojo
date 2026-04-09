import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { ACHIEVEMENTS } from '../../curriculum'

export function AchievementsScreen() {
  const { t } = useLocale()
  const { store, getProgress } = useStore()
  const profile = store.profiles.find(p => p.id === store.activeProfileId)
  if (!profile) return null

  const progress = getProgress(profile.id)
  const unlockedSet = new Set(progress.unlockedAchievementIds)
  const xpInLevel = progress.xp - (progress.level - 1) * 200
  const xpNeeded = 200
  const levelPct = Math.min(100, (xpInLevel / xpNeeded) * 100)

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-2xl font-black text-gray-800">{t('achievements.title')}</h2>

      {/* Stats */}
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-4xl font-black text-primary-400">{progress.xp}</p>
            <p className="text-xs font-semibold text-gray-500">{t('achievements.totalXp', { xp: '' }).trim()}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-secondary-400">{t('achievements.level', { n: progress.level })}</p>
            <p className="text-xs font-semibold text-gray-500">Level</p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar
            value={levelPct}
            label={`${xpInLevel} / ${xpNeeded} XP`}
            height="h-3"
          />
        </div>
      </Card>

      {/* Streak */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            <div>
              <p className="font-black text-2xl text-orange-500">
                {progress.currentStreak}
              </p>
              <p className="text-xs font-semibold text-gray-500">
                {t('achievements.currentStreak', { n: progress.currentStreak })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-600">
              {t('achievements.longestStreak', { n: progress.longestStreak })}
            </p>
          </div>
        </div>
      </Card>

      {/* Badge wall */}
      <div>
        <p className="font-black text-lg text-gray-700 mb-3">
          {t('achievements.badges')} ({unlockedSet.size}/{ACHIEVEMENTS.length})
        </p>
        {ACHIEVEMENTS.length === 0 ? (
          <p className="text-center text-gray-400 font-semibold">
            {t('achievements.noAchievements')}
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {ACHIEVEMENTS.map(a => (
              <Badge
                key={a.id}
                achievement={a}
                unlocked={unlockedSet.has(a.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
