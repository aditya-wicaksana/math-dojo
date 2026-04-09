export type Locale = 'en' | 'id'

export type TopicId =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'geometry'
  | 'place-value'
  | 'time'
  | 'money'
  | 'word-problems'
  | 'patterns'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Stars = 0 | 1 | 2 | 3

export interface UserProfile {
  id: string
  name: string
  avatarIndex: number
  grade: 1 | 2 | 3 | 4 | 5 | 6
  createdAt: number
  lastActiveAt: number
}

export interface SessionRecord {
  id: string
  profileId: string
  topicId: TopicId
  grade: number
  difficulty: Difficulty
  totalQuestions: number
  correctAnswers: number
  durationSeconds: number
  completedAt: number
  stars: Stars
  xpEarned: number
}

export interface TopicProgress {
  topicId: TopicId
  bestStars: Stars
  sessionsCompleted: number
  totalCorrect: number
  totalAttempted: number
}

export interface ProfileProgress {
  profileId: string
  xp: number
  level: number
  totalSessions: number
  currentStreak: number
  longestStreak: number
  lastSessionDate: string | null
  topicProgress: Partial<Record<TopicId, TopicProgress>>
  unlockedAchievementIds: string[]
}

export interface AppStore {
  schemaVersion: 1
  locale: Locale
  activeProfileId: string | null
  profiles: UserProfile[]
  progress: Record<string, ProfileProgress>
  sessions: SessionRecord[]
}
