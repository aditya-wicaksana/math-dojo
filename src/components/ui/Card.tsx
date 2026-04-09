import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  highlight?: boolean
  noPad?: boolean
}

export function Card({ highlight = false, noPad = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={[
        'bg-white rounded-3xl shadow-md',
        noPad ? '' : 'p-4',
        highlight ? 'ring-2 ring-primary-400 shadow-lg shadow-primary-100' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
