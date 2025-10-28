import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';

export function DailyRelax() {
  const [stage, setStage] = useState<'idle' | 'meditating' | 'complete'>('idle');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [hasMeditatedToday, setHasMeditatedToday] = useState(false);
  const { t } = useLanguage();
  const { addPoints } = useUser();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (stage === 'meditating') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setStage('complete');
            if (!hasMeditatedToday) {
              addPoints(100);
              setHasMeditatedToday(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [stage, hasMeditatedToday, addPoints]);

  const startMeditation = () => {
    setTimeLeft(600);
    setStage('meditating');
  };

  const skipToComplete = () => {
    setStage('complete');
    if (!hasMeditatedToday) {
      addPoints(100);
      setHasMeditatedToday(true);
    }
  };

  const reset = () => {
    setStage('idle');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (stage === 'idle') {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-8 text-8xl"
          >
            🧘
          </motion.div>
          <h2 className="mb-4">{t('每日放鬆', 'Daily Relaxation')}</h2>
          <p className="text-gray-600 mb-8">
            {t('花10分鐘冥想，放鬆身心，減輕壓力', 'Take 10 minutes to meditate, relax, and reduce stress')}
          </p>

          {hasMeditatedToday && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-6"
            >
              <p className="text-green-700">✅ {t('今天已完成冥想', 'Meditation completed today')}</p>
            </motion.div>
          )}

          <Button
            onClick={startMeditation}
            disabled={hasMeditatedToday}
            className="w-full h-14 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-lg disabled:opacity-50"
          >
            <Play className="mr-2 h-5 w-5" />
            {t('開始冥想', 'Start Meditation')}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (stage === 'meditating') {
    const progress = ((600 - timeLeft) / 600) * 100;

    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          {/* Breathing Circle */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 0.8, 1]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="text-white text-lg"
            >
              {t('深呼吸...', 'Breathe...')}
            </motion.div>
          </motion.div>

          {/* Timer */}
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-5xl mb-6 text-purple-700"
          >
            {formatTime(timeLeft)}
          </motion.div>

          {/* Progress */}
          <Progress value={progress} className="mb-6 h-3" />

          {/* Relaxing Message */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-gray-600 mb-8"
          >
            {t('放鬆身心，專注呼吸 🌸', 'Relax and focus on your breath 🌸')}
          </motion.p>

          {/* Floating Elements */}
          <div className="relative h-32">
            {[...Array(6)].map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  y: [0, -80, 0],
                  x: [0, (idx % 2 ? 20 : -20), 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: idx * 0.7
                }}
                className="absolute text-2xl"
                style={{ left: `${20 + idx * 12}%` }}
              >
                ✨
              </motion.div>
            ))}
          </div>

          <Button
            onClick={skipToComplete}
            variant="outline"
            size="sm"
            className="fixed bottom-24 right-6"
          >
            {t('⏭️ 模擬完成', '⏭️ Skip')}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-8 text-center max-w-md"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 1 }}
          >
            <Sparkles className="h-24 w-24 text-purple-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="mb-4">{t('冥想完成！', 'Meditation Complete!')}</h2>
          <p className="text-gray-600 mb-6">
            {t('做得好！你已經完成今天的冥想練習', 'Well done! You have completed today\'s meditation')}
          </p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 mb-6"
          >
            <p className="text-gray-600 mb-2">{t('獲得積分', 'Points Earned')}</p>
            <p className="text-purple-600">+100 ✨</p>
          </motion.div>

          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-purple-400 to-blue-400"
          >
            {t('完成', 'Done')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
}
