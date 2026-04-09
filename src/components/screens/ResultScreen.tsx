import { useEffect, useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { StarRating } from '../ui/StarRating'
import { Badge } from '../ui/Badge'
import { Confetti } from '../ui/Confetti'
import { evaluateAchievements } from '../../curriculum'
import type { SessionRecord } from '../../store/types'
import type { AchievementDefinition } from '../../curriculum/achievements'
import { TOPIC_META } from '../../curriculum'

interface ResultScreenProps {
  session: SessionRecord
  onPlayAgain: () => void
  onNewTopic: () => void
  onHome: () => void
}

export function ResultScreen({ session, onPlayAgain, onNewTopic, onHome }: ResultScreenProps) {
  const { t } = useLocale()
  const { getProgress } = useStore()
  const progress = getProgress(session.profileId)
  const [newAchievements, setNewAchievements] = useState<AchievementDefinition[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [starsVisible, setStarsVisible] = useState(false)

  useEffect(() => {
    // Evaluate achievements (progress already updated by PracticeScreen via recordSession)
    const unlocked = evaluateAchievements(progress, session)
    setNewAchievements(unlocked)
    if (session.stars >= 2) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
    setTimeout(() => setStarsVisible(true), 300)
  }, []) // intentional: once on mount

  const pct = Math.round((session.correctAnswers / session.totalQuestions) * 100)
  const meta = TOPIC_META[session.topicId]

  return (
    <div className="flex flex-col items-center gap-5 pt-4 animate-fade-in">
      <Confetti active={showConfetti} />

      {/* Title */}
      <div className="text-center">
        <div className="text-5xl mb-2">🥋</div>
        <h2 className="text-3xl font-black text-gray-800">{t('result.title')}</h2>
      </div>

      {/* Stars */}
      <div className="py-2">
        {starsVisible && <StarRating stars={session.stars} size="lg" animate />}
      </div>

      {/* Score card */}
      <Card className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <p className="font-bold text-gray-700">{t(`topics.${session.topicId}` as `topics.${string}`)}</p>
            <p className="text-xs text-gray-400 capitalize">{session.difficulty}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-50 rounded-2xl p-3">
            <p className="text-2xl font-black text-green-600">{session.correctAnswers}/{session.totalQuestions}</p>
            <p className="text-xs text-gray-500 font-semibold">{t('result.score', { correct: '', total: '' }).trim()}</p>
          </div>
          <div className="bg-primary-50 rounded-2xl p-3">
            <p className="text-2xl font-black text-primary-500">{pct}%</p>
            <p className="text-xs text-gray-500 font-semibold">Score</p>
          </div>
          <div className="bg-secondary-50 rounded-2xl p-3">
            <p className="text-2xl font-black text-secondary-500">
              {session.durationSeconds}s
            </p>
            <p className="text-xs text-gray-500 font-semibold">{t('result.timeLabel')}</p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 bg-accent-100 text-accent-700 font-black px-3 py-1.5 rounded-full text-lg">
            ⭐ {t('result.xpEarned', { xp: session.xpEarned })}
          </span>
        </div>
      </Card>

      {/* New achievements */}
      {newAchievements.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="font-bold text-purple-600 text-center mb-2">🏅 {t('result.newAchievement')}</p>
          <div className="grid grid-cols-3 gap-2">
            {newAchievements.map(a => (
              <Badge key={a.id} achievement={a} unlocked animate />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 w-full max-w-sm mt-2">
        <Button onClick={onPlayAgain} fullWidth size="lg" className="font-black">
          🔄 {t('result.playAgain')}
        </Button>
        <Button onClick={onNewTopic} fullWidth size="lg" variant="secondary">
          📚 {t('result.newTopic')}
        </Button>
        <Button onClick={onHome} fullWidth size="md" variant="ghost">
          🏠 {t('result.home')}
        </Button>
      </div>
    </div>
  )
}
