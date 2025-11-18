import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, BookOpen, Users, Sparkles, Gift, Settings, Home } from 'lucide-react';
import { LanguageProvider, useLanguage } from './lib/language-context';
import { UserProvider, useUser } from './lib/user-context';
import { LoginPage } from './components/LoginPage';
import { MoodCalendar } from './components/MoodCalendar';
import { DailyTasks } from './components/DailyTasks';
import { GroupDiscussion } from './components/GroupDiscussion';
import { DailyRelax } from './components/DailyRelax';
import { RewardsShop } from './components/RewardsShop';
import { ChatBot } from './components/ChatBot';
import { PremiumSubscription } from './components/PremiumSubscription';
import { PremiumPage } from './components/PremiumPage';
import { SettingsMenu } from './components/SettingsMenu';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

type Page = 'calendar' | 'tasks' | 'discussion' | 'relax' | 'rewards' | 'premium';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('calendar');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useUser();
  const { t } = useLanguage();

  if (!user) {
    return <LoginPage />;
  }

  const pages: { id: Page; icon: React.ElementType; zh: string; en: string; studentOnly?: boolean }[] = [
    { id: 'calendar', icon: Calendar, zh: '心情月曆', en: 'Mood Calendar' },
    { id: 'tasks', icon: BookOpen, zh: '每日任務', en: 'Daily Tasks', studentOnly: true },
    { id: 'discussion', icon: Users, zh: '小組討論', en: 'Discussion', studentOnly: true },
    { id: 'relax', icon: Sparkles, zh: '每日放鬆', en: 'Relaxation', studentOnly: true },
    { id: 'rewards', icon: Gift, zh: '積分商店', en: 'Rewards', studentOnly: true },
  ];

  const availablePages = user.role === 'parent' 
    ? pages.filter(p => p.id === 'calendar')
    : pages;

  const renderPage = () => {
    // Parent can only view calendar
    if (user.role === 'parent') {
      return <MoodCalendar />;
    }

    switch (currentPage) {
      case 'calendar':
        return <MoodCalendar />;
      case 'tasks':
        return <DailyTasks />;
      case 'discussion':
        return <GroupDiscussion />;
      case 'relax':
        return <DailyRelax />;
      case 'rewards':
        return <RewardsShop />;
      case 'premium':
        return <PremiumPage onBack={() => setCurrentPage('calendar')} />;
      default:
        return <MoodCalendar />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-lg px-6 py-4 flex items-center justify-between sticky top-0 z-30"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-2xl"
          >
            💖
          </motion.div>
          <div>
            <h1 className="text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {t('心流考生', 'MindFlow DSE')}
            </h1>
            <p className="text-xs text-gray-500">
              {t(`歡迎回來，${user.name}`, `Welcome back, ${user.name}`)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          className="hover:bg-purple-100"
        >
          <Settings className="h-6 w-6 text-purple-500" />
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="pb-20">
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-purple-100 px-4 py-3 z-30"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {availablePages.map((page) => {
            const Icon = page.icon;
            const isActive = currentPage === page.id;

            return (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-purple-100 rounded-xl pointer-events-none"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`h-6 w-6 relative z-10 ${isActive ? 'text-purple-600' : ''}`} />
                <span className="text-xs relative z-10">{t(page.zh, page.en)}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Premium Subscription Button & Chat Bot */}
      {user.role === 'student' && (
        <>
          <PremiumSubscription onOpen={() => setCurrentPage('premium')} />
          <ChatBot />
        </>
      )}

      {/* Settings Menu */}
      <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LanguageProvider>
  );
}
