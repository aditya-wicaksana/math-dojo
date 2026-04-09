import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AppStore, UserProfile, ProfileProgress, SessionRecord } from './types'
import { loadStore, saveStore, defaultProgress, computeLevel, starsForScore } from './storage'
import { nanoid } from 'nanoid'

interface StoreContextValue {
  store: AppStore
  // Profile actions
  createProfile: (name: string, avatarIndex: number, grade: 1 | 2 | 3 | 4 | 5 | 6) => UserProfile
  updateProfile: (id: string, updates: Partial<Pick<UserProfile, 'name' | 'avatarIndex' | 'grade'>>) => void
  deleteProfile: (id: string) => void
  setActiveProfile: (id: string | null) => void
  // Locale
  setLocale: (locale: AppStore['locale']) => void
  // Progress
  recordSession: (session: Omit<SessionRecord, 'id' | 'stars' | 'xpEarned'>) => SessionRecord
  getProgress: (profileId: string) => ProfileProgress
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<AppStore>(() => loadStore())

  const update = useCallback((updater: (s: AppStore) => AppStore) => {
    setStore(prev => {
      const next = updater(prev)
      saveStore(next)
      return next
    })
  }, [])

  const createProfile: StoreContextValue['createProfile'] = useCallback(
    (name, avatarIndex, grade) => {
      const profile: UserProfile = {
        id: nanoid(8),
        name,
        avatarIndex,
        grade,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      }
      update(s => ({
        ...s,
        profiles: [...s.profiles, profile],
        progress: { ...s.progress, [profile.id]: defaultProgress(profile.id) },
        activeProfileId: profile.id,
      }))
      return profile
    },
    [update],
  )

  const updateProfile: StoreContextValue['updateProfile'] = useCallback(
    (id, updates) => {
      update(s => ({
        ...s,
        profiles: s.profiles.map(p =>
          p.id === id ? { ...p, ...updates, lastActiveAt: Date.now() } : p,
        ),
      }))
    },
    [update],
  )

  const deleteProfile: StoreContextValue['deleteProfile'] = useCallback(
    (id) => {
      update(s => {
        const { [id]: _p, ...restProgress } = s.progress
        return {
          ...s,
          profiles: s.profiles.filter(p => p.id !== id),
          progress: restProgress,
          sessions: s.sessions.filter(sess => sess.profileId !== id),
          activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
        }
      })
    },
    [update],
  )

  const setActiveProfile: StoreContextValue['setActiveProfile'] = useCallback(
    (id) => {
      update(s => {
        const profiles = id
          ? s.profiles.map(p => (p.id === id ? { ...p, lastActiveAt: Date.now() } : p))
          : s.profiles
        return { ...s, activeProfileId: id, profiles }
      })
    },
    [update],
  )

  const setLocale: StoreContextValue['setLocale'] = useCallback(
    (locale) => update(s => ({ ...s, locale })),
    [update],
  )

  const getProgress: StoreContextValue['getProgress'] = useCallback(
    (profileId) => store.progress[profileId] ?? defaultProgress(profileId),
    [store.progress],
  )

  const recordSession: StoreContextValue['recordSession'] = useCallback(
    (sessionData) => {
      const stars = starsForScore(sessionData.correctAnswers, sessionData.totalQuestions)
      // XP: 10 per correct, +20 session completion, speed/hint handled by caller via correctAnswers
      const xpEarned = sessionData.correctAnswers * 10 + 20

      const session: SessionRecord = {
        ...sessionData,
        id: nanoid(8),
        stars,
        xpEarned,
      }

      update(s => {
        const prev = s.progress[session.profileId] ?? defaultProgress(session.profileId)
        const today = new Date().toISOString().slice(0, 10)
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

        let currentStreak = prev.currentStreak
        if (prev.lastSessionDate === today) {
          // already counted today
        } else if (prev.lastSessionDate === yesterday) {
          currentStreak += 1
        } else {
          currentStreak = 1
        }
        const longestStreak = Math.max(prev.longestStreak, currentStreak)
        const newXp = prev.xp + xpEarned
        const newLevel = computeLevel(newXp)

        const prevTopic = prev.topicProgress[session.topicId] ?? {
          topicId: session.topicId,
          bestStars: 0 as const,
          sessionsCompleted: 0,
          totalCorrect: 0,
          totalAttempted: 0,
        }
        const updatedTopic = {
          ...prevTopic,
          bestStars: Math.max(prevTopic.bestStars, stars) as typeof stars,
          sessionsCompleted: prevTopic.sessionsCompleted + 1,
          totalCorrect: prevTopic.totalCorrect + session.correctAnswers,
          totalAttempted: prevTopic.totalAttempted + session.totalQuestions,
        }

        const updatedProgress: ProfileProgress = {
          ...prev,
          xp: newXp,
          level: newLevel,
          totalSessions: prev.totalSessions + 1,
          currentStreak,
          longestStreak,
          lastSessionDate: today,
          topicProgress: { ...prev.topicProgress, [session.topicId]: updatedTopic },
        }

        return {
          ...s,
          sessions: [...s.sessions, session],
          progress: { ...s.progress, [session.profileId]: updatedProgress },
        }
      })

      return session
    },
    [update],
  )

  return (
    <StoreContext.Provider
      value={{
        store,
        createProfile,
        updateProfile,
        deleteProfile,
        setActiveProfile,
        setLocale,
        recordSession,
        getProgress,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
