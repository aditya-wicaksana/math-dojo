import type { TopicId } from '../store/types'

export interface TopicMeta {
  id: TopicId
  emoji: string
  color: string // Tailwind bg class
}

export const TOPIC_META: Record<TopicId, TopicMeta> = {
  addition:        { id: 'addition',        emoji: '➕', color: 'bg-primary-400' },
  subtraction:     { id: 'subtraction',     emoji: '➖', color: 'bg-secondary-400' },
  multiplication:  { id: 'multiplication',  emoji: '✖️', color: 'bg-purple-500' },
  division:        { id: 'division',        emoji: '➗', color: 'bg-accent-500' },
  fractions:       { id: 'fractions',       emoji: '🍕', color: 'bg-pink-400' },
  geometry:        { id: 'geometry',        emoji: '📐', color: 'bg-blue-400' },
  'place-value':   { id: 'place-value',     emoji: '🔢', color: 'bg-indigo-400' },
  time:            { id: 'time',            emoji: '⏰', color: 'bg-green-400' },
  money:           { id: 'money',           emoji: '💰', color: 'bg-yellow-400' },
  'word-problems': { id: 'word-problems',   emoji: '📖', color: 'bg-orange-400' },
  patterns:        { id: 'patterns',        emoji: '🔷', color: 'bg-teal-400' },
}

/** Topics available per grade */
export const GRADE_TOPICS: Record<number, TopicId[]> = {
  1: ['addition', 'subtraction', 'place-value', 'patterns'],
  2: ['addition', 'subtraction', 'time', 'money'],
  3: ['multiplication', 'division', 'fractions', 'time'],
  4: ['multiplication', 'division', 'fractions', 'geometry'],
  5: ['fractions', 'geometry', 'place-value', 'word-problems'],
  6: ['word-problems', 'fractions', 'geometry', 'patterns'],
}
