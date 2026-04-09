import type { Problem } from '../../curriculum/generator'
import { useLocale } from '../../i18n'

interface QuestionCardProps {
  problem: Problem
  currentHintIndex: number
}

function NumberLine({ answer }: { answer: number }) {
  const max = Math.max(20, answer + 2)
  const ticks = Math.min(max, 20)
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex items-end gap-0 min-w-[200px]">
        {Array.from({ length: ticks + 1 }, (_, i) => (
          <div key={i} className="flex flex-col items-center" style={{ minWidth: `${100 / (ticks + 1)}%` }}>
            <div className={`w-0.5 h-3 ${i === answer ? 'bg-primary-500' : 'bg-gray-300'}`} />
            <span className={`text-[10px] font-bold ${i === answer ? 'text-primary-500' : 'text-gray-400'}`}>
              {i % 5 === 0 ? i : ''}
            </span>
          </div>
        ))}
      </div>
      <div className="h-0.5 bg-gray-300 -mt-1" />
    </div>
  )
}


function FractionBar({ value }: { value: string }) {
  const [num, den] = value.split('/').map(Number)
  if (!den || den > 10) return null
  return (
    <div className="flex gap-0.5 justify-center py-2">
      {Array.from({ length: den }, (_, i) => (
        <div
          key={i}
          className={`h-8 rounded flex-1 border border-gray-200 ${
            i < num ? 'bg-primary-400' : 'bg-gray-100'
          }`}
          style={{ maxWidth: 32 }}
        />
      ))}
    </div>
  )
}

export function QuestionCard({ problem, currentHintIndex }: QuestionCardProps) {
  const { t } = useLocale()
  const hints = problem.hintSteps.slice(0, currentHintIndex)

  return (
    <div className="flex flex-col gap-4">
      {/* Visual aid */}
      {problem.visualType === 'number-line' && typeof problem.answer === 'number' && (
        <NumberLine answer={problem.answer} />
      )}
      {problem.visualType === 'fraction-bar' && typeof problem.answer === 'string' && (
        <FractionBar value={problem.answer} />
      )}

      {/* Question */}
      <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-3xl p-6 sm:p-8 text-center">
        <p className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight break-words">
          {problem.questionText}
        </p>
      </div>

      {/* Hints */}
      {hints.length > 0 && (
        <div className="bg-accent-50 border-2 border-accent-200 rounded-2xl p-3">
          <p className="text-xs font-bold text-accent-600 mb-1">{t('practice.hintLabel')}</p>
          {hints.map((h, i) => (
            <p key={i} className="text-sm font-semibold text-gray-700">
              {i + 1}. {h}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
