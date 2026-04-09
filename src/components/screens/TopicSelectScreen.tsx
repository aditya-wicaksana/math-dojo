import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { StarRating } from '../ui/StarRating'
import { GRADE_TOPICS, TOPIC_META } from '../../curriculum'
import type { TopicId, Difficulty } from '../../store/types'

interface TopicSelectScreenProps {
  onStart: (topicId: TopicId, difficulty: Difficulty) => void
  onBack: () => void
}

export function TopicSelectScreen({ onStart, onBack }: TopicSelectScreenProps) {
  const { t } = useLocale()
  const { store, getProgress } = useStore()
  const profile = store.profiles.find(p => p.id === store.activeProfileId)
  if (!profile) return null

  const progress = getProgress(profile.id)
  const gradeTopics = GRADE_TOPICS[profile.grade] ?? []
  const [selectedTopic, setSelectedTopic] = useState<TopicId | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const handleTopicClick = (tid: TopicId) => {
    setSelectedTopic(prev => (prev === tid ? null : tid))
    const bestStars = progress.topicProgress[tid]?.bestStars ?? 0
    setDifficulty(bestStars >= 3 ? 'hard' : bestStars >= 2 ? 'medium' : 'easy')
  }

  const handleStart = () => {
    if (selectedTopic) onStart(selectedTopic, difficulty)
  }

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-2xl hover:scale-110 transition-transform">
          ←
        </button>
        <h2 className="text-2xl font-black text-gray-800">
          {t('topicSelect.gradeTopics', { n: profile.grade })}
        </h2>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {gradeTopics.map(tid => {
          const meta = TOPIC_META[tid]
          const tp = progress.topicProgress[tid]
          const isSelected = selectedTopic === tid
          return (
            <button
              key={tid}
              onClick={() => handleTopicClick(tid)}
              className={[
                'flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all active:scale-95',
                isSelected
                  ? 'bg-primary-50 border-primary-400 shadow-lg shadow-primary-100 scale-105'
                  : 'bg-white border-transparent shadow-md hover:border-primary-200 hover:shadow-lg',
              ].join(' ')}
            >
              <span className="text-4xl">{meta.emoji}</span>
              <span className="text-sm font-bold text-gray-700 text-center leading-tight">
                {t(`topics.${tid}` as `topics.${string}`)}
              </span>
              <StarRating stars={tp?.bestStars ?? 0} size="sm" />
              {tp && tp.sessionsCompleted > 0 && (
                <span className="text-xs text-gray-400">
                  {t('topicSelect.sessions', { n: tp.sessionsCompleted })}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Difficulty + Start */}
      {selectedTopic && (
        <Card className="animate-slide-up">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-gray-700">{t('topicSelect.difficultyLabel')}</p>
            <div className="flex gap-2">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={[
                    'flex-1 py-2 rounded-2xl font-bold text-sm transition-all',
                    difficulty === d
                      ? 'bg-primary-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  ].join(' ')}
                >
                  {t(`topicSelect.${d}` as `topicSelect.${string}`)}
                </button>
              ))}
            </div>
            <Button onClick={handleStart} fullWidth size="lg" className="font-black text-xl">
              🥷 {t('topicSelect.start')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
