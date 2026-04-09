import type { AchievementDefinition } from '../../curriculum/achievements'
import { useLocale } from '../../i18n'

interface BadgeProps {
  achievement: AchievementDefinition
  unlocked: boolean
  animate?: boolean
}

export function Badge({ achievement, unlocked, animate = false }: BadgeProps) {
  const { t } = useLocale()
  return (
    <div
      className={[
        'flex flex-col items-center gap-1 p-3 rounded-2xl text-center transition-all',
        unlocked
          ? 'bg-white shadow-md border-2 border-accent-300'
          : 'bg-gray-100 border-2 border-gray-200 opacity-60 grayscale',
        animate ? 'animate-bounce-in' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={`text-3xl ${unlocked ? '' : 'grayscale opacity-40'}`}>
        {achievement.emoji}
      </span>
      <p className={`text-xs font-bold leading-tight ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
        {t(achievement.titleKey)}
      </p>
      {!unlocked && (
        <p className="text-xs text-gray-400">{t('achievements.locked')}</p>
      )}
    </div>
  )
}
