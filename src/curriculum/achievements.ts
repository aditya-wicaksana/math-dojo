import type { ProfileProgress, SessionRecord } from '../store/types'

export interface AchievementDefinition {
  id: string
  category: 'streak' | 'accuracy' | 'speed' | 'topic-mastery' | 'milestone'
  titleKey: string
  descKey: string
  emoji: string
  xpReward: number
  condition: (progress: ProfileProgress, session: SessionRecord) => boolean
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_session',
    category: 'milestone',
    titleKey: 'achievements.first_session_title',
    descKey: 'achievements.first_session_desc',
    emoji: '🎯',
    xpReward: 50,
    condition: (p) => p.totalSessions >= 1,
  },
  {
    id: 'perfect_10',
    category: 'accuracy',
    titleKey: 'achievements.perfect_10_title',
    descKey: 'achievements.perfect_10_desc',
    emoji: '💯',
    xpReward: 80,
    condition: (_p, s) => s.correctAnswers === s.totalQuestions,
  },
  {
    id: 'speed_demon',
    category: 'speed',
    titleKey: 'achievements.speed_demon_title',
    descKey: 'achievements.speed_demon_desc',
    emoji: '⚡',
    xpReward: 60,
    condition: (_p, s) => s.durationSeconds < 60,
  },
  {
    id: 'streak_3',
    category: 'streak',
    titleKey: 'achievements.streak_3_title',
    descKey: 'achievements.streak_3_desc',
    emoji: '🎩',
    xpReward: 60,
    condition: (p) => p.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    category: 'streak',
    titleKey: 'achievements.streak_7_title',
    descKey: 'achievements.streak_7_desc',
    emoji: '⚔️',
    xpReward: 100,
    condition: (p) => p.currentStreak >= 7,
  },
  {
    id: 'streak_30',
    category: 'streak',
    titleKey: 'achievements.streak_30_title',
    descKey: 'achievements.streak_30_desc',
    emoji: '🏆',
    xpReward: 250,
    condition: (p) => p.currentStreak >= 30,
  },
  {
    id: 'add_master',
    category: 'topic-mastery',
    titleKey: 'achievements.add_master_title',
    descKey: 'achievements.add_master_desc',
    emoji: '🌟',
    xpReward: 100,
    condition: (_p, s) =>
      s.topicId === 'addition' && s.difficulty === 'hard' && s.stars === 3,
  },
  {
    id: 'sub_master',
    category: 'topic-mastery',
    titleKey: 'achievements.sub_master_title',
    descKey: 'achievements.sub_master_desc',
    emoji: '⭐',
    xpReward: 100,
    condition: (_p, s) =>
      s.topicId === 'subtraction' && s.difficulty === 'hard' && s.stars === 3,
  },
  {
    id: 'mul_master',
    category: 'topic-mastery',
    titleKey: 'achievements.mul_master_title',
    descKey: 'achievements.mul_master_desc',
    emoji: '🥷',
    xpReward: 120,
    condition: (_p, s) =>
      s.topicId === 'multiplication' && s.difficulty === 'hard' && s.stars === 3,
  },
  {
    id: 'div_master',
    category: 'topic-mastery',
    titleKey: 'achievements.div_master_title',
    descKey: 'achievements.div_master_desc',
    emoji: '🎋',
    xpReward: 120,
    condition: (_p, s) =>
      s.topicId === 'division' && s.difficulty === 'hard' && s.stars === 3,
  },
  {
    id: 'frac_master',
    category: 'topic-mastery',
    titleKey: 'achievements.frac_master_title',
    descKey: 'achievements.frac_master_desc',
    emoji: '🧙',
    xpReward: 130,
    condition: (_p, s) =>
      s.topicId === 'fractions' && s.difficulty === 'hard' && s.stars === 3,
  },
  {
    id: 'sessions_10',
    category: 'milestone',
    titleKey: 'achievements.sessions_10_title',
    descKey: 'achievements.sessions_10_desc',
    emoji: '📚',
    xpReward: 80,
    condition: (p) => p.totalSessions >= 10,
  },
  {
    id: 'sessions_50',
    category: 'milestone',
    titleKey: 'achievements.sessions_50_title',
    descKey: 'achievements.sessions_50_desc',
    emoji: '🎖️',
    xpReward: 150,
    condition: (p) => p.totalSessions >= 50,
  },
  {
    id: 'sessions_100',
    category: 'milestone',
    titleKey: 'achievements.sessions_100_title',
    descKey: 'achievements.sessions_100_desc',
    emoji: '👑',
    xpReward: 300,
    condition: (p) => p.totalSessions >= 100,
  },
  {
    id: 'xp_500',
    category: 'milestone',
    titleKey: 'achievements.xp_500_title',
    descKey: 'achievements.xp_500_desc',
    emoji: '💎',
    xpReward: 0,
    condition: (p) => p.xp >= 500,
  },
  {
    id: 'xp_1000',
    category: 'milestone',
    titleKey: 'achievements.xp_1000_title',
    descKey: 'achievements.xp_1000_desc',
    emoji: '💰',
    xpReward: 0,
    condition: (p) => p.xp >= 1000,
  },
  {
    id: 'level_5',
    category: 'milestone',
    titleKey: 'achievements.level_5_title',
    descKey: 'achievements.level_5_desc',
    emoji: '🌠',
    xpReward: 100,
    condition: (p) => p.level >= 5,
  },
  {
    id: 'level_10',
    category: 'milestone',
    titleKey: 'achievements.level_10_title',
    descKey: 'achievements.level_10_desc',
    emoji: '🥋',
    xpReward: 200,
    condition: (p) => p.level >= 10,
  },
  {
    id: 'no_hints',
    category: 'accuracy',
    titleKey: 'achievements.no_hints_title',
    descKey: 'achievements.no_hints_desc',
    emoji: '🦅',
    xpReward: 50,
    condition: (_p, s) => s.xpEarned >= 120, // 10×10 + 20 session = 120 (no hint penalty)
  },
  {
    id: 'all_topics',
    category: 'topic-mastery',
    titleKey: 'achievements.all_topics_title',
    descKey: 'achievements.all_topics_desc',
    emoji: '🌈',
    xpReward: 200,
    condition: (p) =>
      Object.values(p.topicProgress).every((tp) => tp && tp.bestStars >= 1),
  },
]

export function evaluateAchievements(
  progress: ProfileProgress,
  session: SessionRecord,
): AchievementDefinition[] {
  const alreadyUnlocked = new Set(progress.unlockedAchievementIds)
  return ACHIEVEMENTS.filter(
    (a) => !alreadyUnlocked.has(a.id) && a.condition(progress, session),
  )
}
