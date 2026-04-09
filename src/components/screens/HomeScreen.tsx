import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { StarRating } from '../ui/StarRating'
import { GRADE_TOPICS, TOPIC_META } from '../../curriculum'

const AVATARS = ['🐱', '🐶', '🐸', '🦊', '🐼', '🐨', '🦁', '🐯', '🦄', '🤖', '👾', '🦋']

interface HomeScreenProps {
  onQuickPractice: () => void
  onTopicSelect: () => void
  onGoAchievements: () => void
}

export function HomeScreen({ onQuickPractice, onTopicSelect, onGoAchievements }: HomeScreenProps) {
  const { t } = useLocale()
  const { store, getProgress } = useStore()
  const profile = store.profiles.find(p => p.id === store.activeProfileId)
  if (!profile) return null

  const progress = getProgress(profile.id)
  const xpForThisLevel = (progress.level - 1) * 200
  const xpForNextLevel = progress.level * 200
  const xpInLevel = progress.xp - xpForThisLevel
  const xpNeeded = xpForNextLevel - xpForThisLevel
  const levelPct = Math.min(100, (xpInLevel / xpNeeded) * 100)

  const gradeTopics = GRADE_TOPICS[profile.grade] ?? []
  const recentSessions = [...store.sessions]
    .filter(s => s.profileId === profile.id)
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 3)


  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Greeting + level */}
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{AVATARS[profile.avatarIndex]}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-xl text-gray-800 truncate">
              {t('home.greeting', { name: profile.name })}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                {t('home.level', { n: progress.level })}
              </span>
              {progress.currentStreak > 0 && (
                <span className="text-xs font-bold text-orange-500">
                  {t('home.streak', { n: progress.currentStreak })}
                </span>
              )}
            </div>
          </div>
        </div>
        <ProgressBar
          value={levelPct}
          label={t('home.xpToNext', { xp: xpNeeded - xpInLevel })}
          color="bg-primary-400"
          height="h-4"
        />
      </Card>

      {/* Quick Practice */}
      <Button
        size="xl"
        fullWidth
        onClick={onQuickPractice}
        className="text-2xl font-black shadow-lg shadow-primary-200"
      >
        ⚡ {t('home.quickPractice')}
      </Button>

      {/* Topic grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-lg text-gray-700">{t('home.topics')}</h3>
          <button
            onClick={onTopicSelect}
            className="text-sm font-bold text-primary-400 hover:text-primary-500"
          >
            See all →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gradeTopics.map(tid => {
            const meta = TOPIC_META[tid]
            const tp = progress.topicProgress[tid]
            return (
              <button
                key={tid}
                onClick={onTopicSelect}
                className="flex flex-col items-center gap-1 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <span className="text-3xl">{meta.emoji}</span>
                <span className="text-xs font-bold text-gray-700 text-center leading-tight">
                  {t(`topics.${tid}` as `topics.${string}`)}
                </span>
                <StarRating stars={tp?.bestStars ?? 0} size="sm" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <h3 className="font-black text-lg text-gray-700 mb-3">{t('home.recentSessions')}</h3>
        {recentSessions.length === 0 ? (
          <Card>
            <p className="text-center text-gray-400 font-semibold py-2">
              {t('home.noSessions')}
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {recentSessions.map(s => {
              const meta = TOPIC_META[s.topicId]
              return (
                <Card key={s.id} noPad>
                  <div className="flex items-center gap-3 p-3">
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm">
                        {t(`topics.${s.topicId}` as `topics.${string}`)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.correctAnswers}/{s.totalQuestions} correct
                      </p>
                    </div>
                    <StarRating stars={s.stars} size="sm" />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Achievements CTA */}
      <button
        onClick={onGoAchievements}
        className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-accent-50 rounded-3xl border-2 border-purple-100 hover:shadow-md transition-all active:scale-95"
      >
        <span className="text-3xl">🏆</span>
        <div className="text-left">
          <p className="font-bold text-gray-700">{t('nav.achievements')}</p>
          <p className="text-xs text-gray-500">
            {progress.unlockedAchievementIds.length} unlocked •{' '}
            {t('home.totalXp', { xp: progress.xp })}
          </p>
        </div>
        <span className="ml-auto text-gray-400">→</span>
      </button>
    </div>
  )
}
