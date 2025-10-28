import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Mic, MicOff, Award, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';

const topics = [
  { zh: '科技對教育的影響', en: 'Impact of Technology on Education' },
  { zh: '環保與可持續發展', en: 'Environmental Protection and Sustainable Development' },
  { zh: '社交媒體的利弊', en: 'Pros and Cons of Social Media' },
  { zh: '未來職業發展趨勢', en: 'Future Career Development Trends' },
];

const studentNames = ['Alex', 'Bella', 'Chris', 'Diana', 'Emma', 'Felix'];

export function GroupDiscussion() {
  const [stage, setStage] = useState<'idle' | 'matching' | 'preparing' | 'discussing' | 'result'>('idle');
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [prepTime, setPrepTime] = useState(60);
  const [discussTime, setDiscussTime] = useState(480); // 8 minutes
  const [isMicOn, setIsMicOn] = useState(false);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const { t } = useLanguage();
  const { addPoints } = useUser();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (stage === 'matching') {
      interval = setInterval(() => {
        setMatchingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Select random members
            const selected = [...studentNames].sort(() => Math.random() - 0.5).slice(0, 3);
            setGroupMembers(selected);
            setTopic(topics[Math.floor(Math.random() * topics.length)][t('zh', 'en')]);
            setTimeout(() => setStage('preparing'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }

    if (stage === 'preparing') {
      interval = setInterval(() => {
        setPrepTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setStage('discussing');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (stage === 'discussing') {
      interval = setInterval(() => {
        setDiscussTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setStage('result');
            addPoints(80);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [stage, t, addPoints]);

  const startMatching = () => {
    setMatchingProgress(0);
    setPrepTime(60);
    setDiscussTime(480);
    setStage('matching');
  };

  const skipToResult = () => {
    setStage('result');
    addPoints(80);
  };

  const reset = () => {
    setStage('idle');
    setIsMicOn(false);
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
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <Users className="h-24 w-24 text-purple-500 mx-auto" />
          </motion.div>
          <h2 className="mb-4">{t('小組討論', 'Group Discussion')}</h2>
          <p className="text-gray-600 mb-8">
            {t('與其他同學進行小組討論，提升溝通能力', 'Discuss with classmates to improve communication skills')}
          </p>
          <Button
            onClick={startMatching}
            className="w-full h-14 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-lg"
          >
            {t('🔍 開始匹配', '🔍 Start Matching')}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (stage === 'matching') {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mb-8"
          >
            <Users className="h-24 w-24 text-purple-500 mx-auto" />
          </motion.div>
          <h2 className="mb-4">{t('正在匹配中...', 'Matching...')}</h2>
          <Progress value={matchingProgress} className="mb-4" />
          <p className="text-gray-600">{t('正在尋找合適的組員', 'Finding suitable group members')}</p>
        </motion.div>
      </div>
    );
  }

  if (stage === 'preparing') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white text-center"
        >
          <Clock className="h-12 w-12 mx-auto mb-2" />
          <h2>{t('準備時間', 'Preparation Time')}</h2>
          <motion.div
            key={prepTime}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl mt-2"
          >
            {formatTime(prepTime)}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="mb-4 text-center text-purple-600">{t('討論主題', 'Discussion Topic')}</h3>
          <p className="text-center text-lg mb-6">{topic}</p>
          
          <div className="space-y-3">
            <p className="text-gray-600 text-center">{t('你的組員', 'Your Group Members')}</p>
            {groupMembers.map((name, idx) => (
              <motion.div
                key={name}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white">
                  {name[0]}
                </div>
                <span>{name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (stage === 'discussing') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl p-6 text-white text-center"
        >
          <h2>{t('討論進行中', 'Discussion in Progress')}</h2>
          <motion.div
            key={discussTime}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl mt-2"
          >
            {formatTime(discussTime)}
          </motion.div>
          <Progress value={(discussTime / 480) * 100} className="mt-4 bg-white/30" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-center text-gray-600 mb-4">{topic}</p>
          
          <div className="flex justify-center mb-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMicOn(!isMicOn)}
              className={`h-20 w-20 rounded-full ${
                isMicOn
                  ? 'bg-gradient-to-r from-red-400 to-pink-400'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
              } shadow-lg flex items-center justify-center text-white`}
            >
              {isMicOn ? <Mic className="h-10 w-10" /> : <MicOff className="h-10 w-10" />}
            </motion.button>
          </div>

          {isMicOn && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-center text-red-500"
            >
              🔴 {t('錄音中...', 'Recording...')}
            </motion.div>
          )}

          <div className="space-y-2 mt-6">
            {groupMembers.map((name, idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                className="bg-gray-100 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm">
                  {name[0]}
                </div>
                <span className="text-sm">{name}</span>
                <div className="ml-auto flex gap-1">
                  {[1, 2, 3].map(bar => (
                    <motion.div
                      key={bar}
                      animate={{ height: [10, 20, 10] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: bar * 0.1 }}
                      className="w-1 bg-purple-400 rounded"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Button
          onClick={skipToResult}
          variant="outline"
          size="sm"
          className="fixed bottom-24 right-6"
        >
          {t('⏭️ 模擬完成', '⏭️ Skip')}
        </Button>
      </div>
    );
  }

  if (stage === 'result') {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Award className="h-24 w-24 text-yellow-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="mb-4">{t('討論完成！', 'Discussion Complete!')}</h2>
          
          <div className="space-y-3 mb-6">
            <div className="bg-white rounded-xl p-4">
              <p className="text-gray-600 text-sm">{t('表達能力', 'Expression')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={85} />
                <span className="text-sm">85%</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-gray-600 text-sm">{t('合作精神', 'Teamwork')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={90} />
                <span className="text-sm">90%</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-gray-600 text-sm">{t('內容深度', 'Content Depth')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={80} />
                <span className="text-sm">80%</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 mb-6"
          >
            <p className="text-gray-600 mb-2">{t('獲得積分', 'Points Earned')}</p>
            <p className="text-purple-600">+80 ✨</p>
          </motion.div>

          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400"
          >
            {t('完成', 'Done')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
}
