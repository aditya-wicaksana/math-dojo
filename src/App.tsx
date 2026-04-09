import { useState, useMemo } from 'react'
import { StoreProvider, useStore } from './store/StoreContext'
import { LocaleContext, makeT } from './i18n'
import { AppShell } from './components/layout/AppShell'
import { WelcomeScreen } from './components/screens/WelcomeScreen'
import { HomeScreen } from './components/screens/HomeScreen'
import { TopicSelectScreen } from './components/screens/TopicSelectScreen'
import { PracticeScreen } from './components/screens/PracticeScreen'
import { ResultScreen } from './components/screens/ResultScreen'
import { AchievementsScreen } from './components/screens/AchievementsScreen'
import { SettingsScreen } from './components/screens/SettingsScreen'
import { ProfileScreen } from './components/screens/ProfileScreen'
import { Modal } from './components/ui/Modal'
import type { NavTab } from './components/layout/BottomNav'
import type { TopicId, Difficulty, SessionRecord } from './store/types'
import { GRADE_TOPICS } from './curriculum'

type Screen =
  | { name: 'welcome' }
  | { name: 'home' }
  | { name: 'topic-select' }
  | { name: 'practice'; topicId: TopicId; difficulty: Difficulty }
  | { name: 'result'; session: SessionRecord; topicId: TopicId; difficulty: Difficulty }
  | { name: 'achievements' }
  | { name: 'settings' }

function AppContent() {
  const { store } = useStore()
  const [screen, setScreen] = useState<Screen>(() =>
    store.activeProfileId ? { name: 'home' } : { name: 'welcome' },
  )
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  const t = useMemo(() => makeT(store.locale), [store.locale])
  const localeCtx = useMemo(() => ({ locale: store.locale, t }), [store.locale, t])

  const go = (s: Screen) => {
    setScreen(s)
    if (s.name === 'home') setActiveTab('home')
    if (s.name === 'achievements') setActiveTab('achievements')
    if (s.name === 'settings') setActiveTab('settings')
    if (s.name === 'topic-select') setActiveTab('practice')
  }

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab)
    if (tab === 'home') go({ name: 'home' })
    else if (tab === 'practice') go({ name: 'topic-select' })
    else if (tab === 'achievements') go({ name: 'achievements' })
    else if (tab === 'settings') go({ name: 'settings' })
  }

  const profile = store.profiles.find(p => p.id === store.activeProfileId)

  // Quick practice: pick weakest topic for grade
  const handleQuickPractice = () => {
    if (!profile) return
    const gradeTopics = GRADE_TOPICS[profile.grade] ?? []
    const progress = store.progress[profile.id]
    const weakest: TopicId = gradeTopics.reduce<TopicId>((w, tid) => {
      const a = progress?.topicProgress?.[w]?.bestStars ?? 0
      const b = progress?.topicProgress?.[tid]?.bestStars ?? 0
      return b < a ? tid : w
    }, gradeTopics[0])
    const bestStars = progress?.topicProgress?.[weakest]?.bestStars ?? 0
    const difficulty: Difficulty = bestStars >= 3 ? 'hard' : bestStars >= 2 ? 'medium' : 'easy'
    go({ name: 'practice', topicId: weakest, difficulty })
  }

  // Full-screen practice (hide nav)
  const isPractice = screen.name === 'practice' || screen.name === 'result'

  return (
    <LocaleContext.Provider value={localeCtx}>
      {screen.name === 'welcome' ? (
        <WelcomeScreen onProfileSelected={() => go({ name: 'home' })} />
      ) : (
        <AppShell
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hideNav={isPractice}
          onProfileClick={() => setShowEditProfile(true)}
          onSettingsClick={() => go({ name: 'settings' })}
        >
          {screen.name === 'home' && (
            <HomeScreen
              onQuickPractice={handleQuickPractice}
              onTopicSelect={() => go({ name: 'topic-select' })}
              onGoAchievements={() => go({ name: 'achievements' })}
            />
          )}
          {screen.name === 'topic-select' && (
            <TopicSelectScreen
              onStart={(topicId, difficulty) =>
                go({ name: 'practice', topicId, difficulty })
              }
              onBack={() => go({ name: 'home' })}
            />
          )}
          {screen.name === 'practice' && (
            <PracticeScreen
              topicId={screen.topicId}
              difficulty={screen.difficulty}
              onComplete={(session) =>
                go({
                  name: 'result',
                  session,
                  topicId: screen.topicId,
                  difficulty: screen.difficulty,
                })
              }
              onExit={() => go({ name: 'topic-select' })}
            />
          )}
          {screen.name === 'result' && (
            <ResultScreen
              session={screen.session}
              onPlayAgain={() =>
                go({
                  name: 'practice',
                  topicId: screen.topicId,
                  difficulty: screen.difficulty,
                })
              }
              onNewTopic={() => go({ name: 'topic-select' })}
              onHome={() => go({ name: 'home' })}
            />
          )}
          {screen.name === 'achievements' && <AchievementsScreen />}
          {screen.name === 'settings' && (
            <SettingsScreen onSwitchProfile={() => go({ name: 'welcome' })} />
          )}
        </AppShell>
      )}

      {/* Edit profile modal */}
      <Modal open={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <ProfileScreen
          profileId={store.activeProfileId ?? undefined}
          onSave={() => setShowEditProfile(false)}
          onCancel={() => setShowEditProfile(false)}
        />
      </Modal>
    </LocaleContext.Provider>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
