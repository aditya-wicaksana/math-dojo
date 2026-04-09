import type { Stars } from '../../store/types'

interface StarRatingProps {
  stars: Stars
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'text-lg', md: 'text-3xl', lg: 'text-5xl' }

export function StarRating({ stars, animate = false, size = 'md' }: StarRatingProps) {
  return (
    <div className="flex gap-1 items-center justify-center">
      {([0, 1, 2] as const).map((i) => {
        const filled = i < stars
        return (
          <span
            key={i}
            className={[
              sizeMap[size],
              animate && filled ? `animate-star-pop` : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={animate && filled ? { animationDelay: `${i * 200}ms`, opacity: 0 } : undefined}
          >
            {filled ? '⭐' : '☆'}
          </span>
        )
      })}
    </div>
  )
}
