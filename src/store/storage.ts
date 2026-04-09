import type { AppStore, ProfileProgress } from './types'

const STORAGE_KEY = 'math-dojo'

export function defaultProgress(profileId: string): ProfileProgress {
  return {
    profileId,
    xp: 0,
    level: 1,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
    topicProgress: {},
    unlockedAchievementIds: [],
  }
}

export function defaultStore(): AppStore {
  return {
    schemaVersion: 1,
    locale: 'en',
    activeProfileId: null,
    profiles: [],
    progress: {},
    sessions: [],
  }
}

export function loadStore(): AppStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStore()
    const parsed = JSON.parse(raw) as Partial<AppStore>
    return migrateStore(parsed)
  } catch {
    return defaultStore()
  }
}

export function saveStore(store: AppStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Storage full — silently continue
  }
}

export function migrateStore(raw: Partial<AppStore>): AppStore {
  const defaults = defaultStore()
  return {
    schemaVersion: 1,
    locale: raw.locale ?? defaults.locale,
    activeProfileId: raw.activeProfileId ?? defaults.activeProfileId,
    profiles: raw.profiles ?? defaults.profiles,
    progress: raw.progress ?? defaults.progress,
    sessions: raw.sessions ?? defaults.sessions,
  }
}

export function computeLevel(xp: number): number {
  return Math.min(Math.floor(xp / 200) + 1, 30)
}

export function xpForNextLevel(level: number): number {
  return level * 200
}

export function starsForScore(correct: number, total: number): 0 | 1 | 2 | 3 {
  const pct = total > 0 ? correct / total : 0
  if (pct >= 0.9) return 3
  if (pct >= 0.7) return 2
  if (pct >= 0.5) return 1
  return 0
}
