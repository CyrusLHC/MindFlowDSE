import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';

const moods = [
  { id: 'happy', emoji: '😊', zh: '開心', en: 'Happy', color: 'bg-yellow-200' },
  { id: 'excited', emoji: '🤩', zh: '興奮', en: 'Excited', color: 'bg-orange-200' },
  { id: 'relaxed', emoji: '😌', zh: '放鬆', en: 'Relaxed', color: 'bg-green-200' },
  { id: 'proud', emoji: '😎', zh: '自豪', en: 'Proud', color: 'bg-blue-200' },
  { id: 'ecstatic', emoji: '🥳', zh: '狂喜', en: 'Ecstatic', color: 'bg-pink-200' },
  { id: 'calm', emoji: '😇', zh: '平靜', en: 'Calm', color: 'bg-purple-200' },
  { id: 'bored', emoji: '😐', zh: '無聊', en: 'Bored', color: 'bg-gray-200' },
  { id: 'alone', emoji: '😔', zh: '孤單', en: 'Alone', color: 'bg-blue-300' },
  { id: 'crush', emoji: '🥰', zh: '心動', en: 'Crush', color: 'bg-red-200' },
  { id: 'sweet', emoji: '💖', zh: '甜蜜', en: 'Sweet', color: 'bg-pink-300' },
  { id: 'sad', emoji: '😢', zh: '傷心', en: 'Sad', color: 'bg-blue-400' },
  { id: 'tired', emoji: '😴', zh: '疲倦', en: 'Tired', color: 'bg-purple-300' },
  { id: 'worried', emoji: '😰', zh: '擔心', en: 'Worried', color: 'bg-yellow-300' },
  { id: 'stressed', emoji: '😫', zh: '壓力', en: 'Stressed', color: 'bg-orange-300' },
  { id: 'angry', emoji: '😠', zh: '憤怒', en: 'Angry', color: 'bg-red-300' },
];

// Generate sample moods for past days
const generateSampleMoods = () => {
  const sampleMoods: { [key: string]: typeof moods[0] } = {};
  const today = new Date();
  
  // Add moods for the past 20 days (with some days empty)
  for (let i = 1; i < 20; i++) {
    // Skip some days randomly for realism (30% chance to skip)
    if (Math.random() < 0.3) continue;
    
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    sampleMoods[key] = randomMood;
  }
  
  return sampleMoods;
};

export function MoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMoods, setSelectedMoods] = useState<{ [key: string]: typeof moods[0] }>({});
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const { t } = useLanguage();
  const { user } = useUser();
  
  // Initialize with sample moods on mount
  useEffect(() => {
    setSelectedMoods(generateSampleMoods());
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMoods({ ...selectedMoods, [todayKey]: mood });
    setShowMoodPicker(false);
  };

  const getDayKey = (day: number) => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Calendar Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl p-4 shadow-lg"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="text-white hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-center">
          <h2>{currentDate.getFullYear()}</h2>
          <p>{currentDate.toLocaleDateString(t('zh-TW', 'en-US'), { month: 'long' })}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="text-white hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {[t('日', 'Sun'), t('一', 'Mon'), t('二', 'Tue'), t('三', 'Wed'), t('四', 'Thu'), t('五', 'Fri'), t('六', 'Sat')].map((day) => (
            <div key={day} className="text-center text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dayKey = getDayKey(day);
            const isToday = dayKey === todayKey;
            const mood = selectedMoods[dayKey];

            return (
              <motion.div
                key={day}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.01 }}
                className={`aspect-square rounded-xl border-2 p-2 flex flex-col items-center justify-center ${
                  isToday ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
                }`}
              >
                <div className="text-xs text-gray-600">{day}</div>
                {mood && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    {mood.emoji}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Add Mood Button - Only show for students */}
      {user?.role === 'student' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setShowMoodPicker(true)}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 shadow-lg text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t('新增今天心情', 'Add Today\'s Mood')}
          </Button>
        </motion.div>
      )}

      {/* Mood Picker Sheet */}
      <AnimatePresence>
        {showMoodPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoodPicker(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              <h3 className="text-center mb-6">{t('選擇你的心情', 'Choose Your Mood')}</h3>
              <div className="grid grid-cols-3 gap-4">
                {moods.map((mood, idx) => (
                  <motion.button
                    key={mood.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMoodSelect(mood)}
                    className={`${mood.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}
                  >
                    <div className="text-4xl">{mood.emoji}</div>
                    <div className="text-sm">{t(mood.zh, mood.en)}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
