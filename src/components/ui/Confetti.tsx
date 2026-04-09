import { useEffect, useState } from 'react'

const COLORS = ['#FF6B35', '#4ECDC4', '#FFE66D', '#A855F7', '#FF6584', '#3BCEAC']
const COUNT = 30

interface Piece {
  id: number
  color: string
  left: string
  delay: string
  size: string
}

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (active) {
      setPieces(
        Array.from({ length: COUNT }, (_, i) => ({
          id: i,
          color: COLORS[i % COLORS.length],
          left: `${Math.random() * 90 + 5}%`,
          delay: `${Math.random() * 0.6}s`,
          size: `${6 + Math.random() * 8}px`,
        })),
      )
    } else {
      setPieces([])
    }
  }, [active])

  if (!active || pieces.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti-fall rounded-sm"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
