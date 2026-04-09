import { useState, useCallback, useRef } from 'react'
import type { TopicId, Difficulty } from '../store/types'
import type { TFunction } from '../i18n'
import { generateSession, checkAnswer } from '../curriculum/generator'
import type { Problem } from '../curriculum/generator'

export type SessionPhase = 'idle' | 'question' | 'feedback' | 'complete'

export interface SessionState {
  phase: SessionPhase
  problems: Problem[]
  currentIndex: number
  userInput: string
  isCorrect: boolean | null
  correctAnswers: number
  hintsUsed: number
  currentHintIndex: number
  startTime: number
  questionStartTime: number
  lastAnswerTime: number   // ms for speed bonus calculation
}

export interface UseSessionReturn {
  state: SessionState
  start: (topicId: TopicId, grade: number, difficulty: Difficulty, t: TFunction) => void
  setInput: (val: string) => void
  submit: () => void
  next: () => void
  showHint: () => void
  reset: () => void
  elapsedSeconds: () => number
}

const QUESTIONS_PER_SESSION = 10

const INITIAL: SessionState = {
  phase: 'idle',
  problems: [],
  currentIndex: 0,
  userInput: '',
  isCorrect: null,
  correctAnswers: 0,
  hintsUsed: 0,
  currentHintIndex: 0,
  startTime: 0,
  questionStartTime: 0,
  lastAnswerTime: 0,
}

export function useSession(): UseSessionReturn {
  const [state, setState] = useState<SessionState>(INITIAL)
  const startTimeRef = useRef(0)

  const start = useCallback(
    (topicId: TopicId, grade: number, difficulty: Difficulty, t: TFunction) => {
      const problems = generateSession(topicId, grade, difficulty, t, QUESTIONS_PER_SESSION)
      const now = Date.now()
      startTimeRef.current = now
      setState({
        phase: 'question',
        problems,
        currentIndex: 0,
        userInput: '',
        isCorrect: null,
        correctAnswers: 0,
        hintsUsed: 0,
        currentHintIndex: 0,
        startTime: now,
        questionStartTime: now,
        lastAnswerTime: 0,
      })
    },
    [],
  )

  const setInput = useCallback((val: string) => {
    setState(s => ({ ...s, userInput: val }))
  }, [])

  const submit = useCallback(() => {
    setState(s => {
      if (s.phase !== 'question' || !s.userInput.trim()) return s
      const problem = s.problems[s.currentIndex]
      const correct = checkAnswer(problem, s.userInput)
      return {
        ...s,
        phase: 'feedback',
        isCorrect: correct,
        correctAnswers: correct ? s.correctAnswers + 1 : s.correctAnswers,
        lastAnswerTime: Date.now(),
      }
    })
  }, [])

  const next = useCallback(() => {
    setState(s => {
      if (s.phase !== 'feedback') return s
      const nextIndex = s.currentIndex + 1
      if (nextIndex >= s.problems.length) {
        return { ...s, phase: 'complete' }
      }
      return {
        ...s,
        phase: 'question',
        currentIndex: nextIndex,
        userInput: '',
        isCorrect: null,
        currentHintIndex: 0,
        questionStartTime: Date.now(),
      }
    })
  }, [])

  const showHint = useCallback(() => {
    setState(s => {
      const problem = s.problems[s.currentIndex]
      const maxHints = problem?.hintSteps.length ?? 0
      if (s.currentHintIndex >= maxHints) return s
      return {
        ...s,
        hintsUsed: s.hintsUsed + 1,
        currentHintIndex: Math.min(s.currentHintIndex + 1, maxHints),
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL)
  }, [])

  const elapsedSeconds = useCallback(() => {
    if (startTimeRef.current === 0) return 0
    return Math.floor((Date.now() - startTimeRef.current) / 1000)
  }, [])

  return { state, start, setInput, submit, next, showHint, reset, elapsedSeconds }
}
