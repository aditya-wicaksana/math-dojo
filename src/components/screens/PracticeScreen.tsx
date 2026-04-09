import { useEffect, useRef } from 'react'
import { useStore } from '../../store/StoreContext'
import { useLocale } from '../../i18n'
import { useSession } from '../../hooks/useSession'
import { Button } from '../ui/Button'
import { QuestionCard } from '../practice/QuestionCard'
import { NumberPad } from '../practice/NumberPad'
import { AnswerFeedback } from '../practice/AnswerFeedback'
import { SessionTimer } from '../practice/SessionTimer'
import type { TopicId, Difficulty } from '../../store/types'
import type { SessionRecord } from '../../store/types'
import { TOPIC_META } from '../../curriculum'

interface PracticeScreenProps {
  topicId: TopicId
  difficulty: Difficulty
  onComplete: (session: SessionRecord) => void
  onExit: () => void
}

export function PracticeScreen({ topicId, difficulty, onComplete, onExit }: PracticeScreenProps) {
  const { t } = useLocale()
  const { store, recordSession } = useStore()
  const profile = store.profiles.find(p => p.id === store.activeProfileId)
  const { state, start, setInput, submit, next, showHint } = useSession()
  const inputRef = useRef<HTMLInputElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startedRef.current && profile) {
      startedRef.current = true
      start(topicId, profile.grade, difficulty, t)
    }
  }, []) // intentional: only once

  // Focus input on each new question
  useEffect(() => {
    if (state.phase === 'question') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [state.phase, state.currentIndex])

  // Complete session
  useEffect(() => {
    if (state.phase === 'complete' && profile) {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000)
      const session = recordSession({
        profileId: profile.id,
        topicId,
        grade: profile.grade,
        difficulty,
        totalQuestions: state.problems.length,
        correctAnswers: state.correctAnswers,
        durationSeconds: elapsed,
        completedAt: Date.now(),
      })
      onComplete(session)
    }
  }, [state.phase]) // intentional: only trigger on phase change

  if (state.phase === 'idle') return null

  const problem = state.problems[state.currentIndex]
  const hintsLeft = problem ? problem.hintSteps.length - state.currentHintIndex : 0
  const meta = TOPIC_META[topicId]

  return (
    <div className="flex flex-col min-h-[calc(100dvh-56px)] relative">
      {/* Top bar */}
      <div className="flex items-center gap-3 py-3">
        <button
          onClick={onExit}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xl"
        >
          ✕
        </button>

        {/* Progress dots */}
        <div className="flex-1 flex gap-1">
          {state.problems.map((_, i) => (
            <div
              key={i}
              className={[
                'flex-1 h-2 rounded-full transition-all',
                i < state.currentIndex
                  ? 'bg-green-400'
                  : i === state.currentIndex
                    ? 'bg-primary-400'
                    : 'bg-gray-200',
              ].join(' ')}
            />
          ))}
        </div>

        <SessionTimer running={state.phase === 'question'} />
      </div>

      {/* Topic + question number */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{meta.emoji}</span>
        <span className="text-sm font-bold text-gray-500">
          {t('practice.question', {
            current: state.currentIndex + 1,
            total: state.problems.length,
          })}
        </span>
        <span className="ml-auto text-sm font-bold text-green-600">
          ✓ {state.correctAnswers}
        </span>
      </div>

      {/* Question */}
      {problem && (
        <div className="flex-1 flex flex-col gap-4">
          <QuestionCard problem={problem} currentHintIndex={state.currentHintIndex} />

          {/* Answer input (desktop visible) */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={state.userInput}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder={t('practice.typeAnswer')}
              className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-2xl font-black text-center text-gray-800 focus:border-primary-400 focus:outline-none transition-colors"
            />
            <Button
              onClick={submit}
              disabled={!state.userInput.trim()}
              size="lg"
              className="hidden md:flex font-black"
            >
              {t('practice.checkAnswer')}
            </Button>
          </div>

          {/* Hint button */}
          <div className="flex justify-center">
            <button
              onClick={showHint}
              disabled={hintsLeft === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-accent-50 text-accent-600 font-bold text-sm hover:bg-accent-100 disabled:opacity-40 transition-colors"
            >
              💡 {t('practice.hint')}
              {hintsLeft > 0 && (
                <span className="text-xs text-gray-400">
                  ({t('practice.hintsLeft', { n: hintsLeft })})
                </span>
              )}
            </button>
          </div>

          {/* Number pad (mobile only) */}
          <NumberPad
            value={state.userInput}
            onChange={setInput}
            onSubmit={submit}
            allowFraction={problem.answerType === 'fraction'}
          />
        </div>
      )}

      {/* Feedback overlay */}
      {state.phase === 'feedback' && problem && (
        <AnswerFeedback
          isCorrect={state.isCorrect ?? false}
          problem={problem}
          onNext={next}
        />
      )}
    </div>
  )
}
