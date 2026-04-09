import { useEffect, useState } from 'react'
import { useLocale } from '../../i18n'
import type { Problem } from '../../curriculum/generator'

interface AnswerFeedbackProps {
  isCorrect: boolean
  problem: Problem
  onNext: () => void
}

export function AnswerFeedback({ isCorrect, problem, onNext }: AnswerFeedbackProps) {
  const { t } = useLocale()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onNext, 150)
    }, 1400)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div
      className={[
        'fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-150',
        visible ? 'opacity-100' : 'opacity-0',
        isCorrect ? 'bg-green-500/20' : 'bg-red-500/20',
      ].join(' ')}
      onClick={() => { setVisible(false); setTimeout(onNext, 150) }}
    >
      <div
        className={[
          'bg-white rounded-3xl shadow-2xl p-8 text-center animate-bounce-in',
          isCorrect ? 'border-4 border-green-400' : 'border-4 border-red-400',
        ].join(' ')}
      >
        <div className="text-6xl mb-3">{isCorrect ? '🎉' : '😅'}</div>
        <p
          className={`text-2xl font-black mb-2 ${
            isCorrect ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {isCorrect ? t('practice.correct') : t('practice.wrong')}
        </p>
        {!isCorrect && (
          <p className="text-gray-500 font-semibold text-sm">
            {t('practice.correctAnswer', { answer: String(problem.answer) })}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-3">tap to continue</p>
      </div>
    </div>
  )
}
