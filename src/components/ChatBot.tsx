import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLanguage } from '../lib/language-context';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const botResponses = [
    { zh: '我在這裡陪著你！有什麼想聊的嗎？😊', en: "I'm here for you! What would you like to talk about? 😊" },
    { zh: '記得深呼吸，慢慢來，一切都會好起來的 💕', en: 'Remember to breathe deeply, take your time, everything will be okay 💕' },
    { zh: '你做得很好！繼續加油！✨', en: "You're doing great! Keep it up! ✨" },
    { zh: '感覺壓力大的時候，試試冥想功能吧 🧘', en: 'When feeling stressed, try the meditation feature 🧘' },
    { zh: '每一天都是新的開始，相信自己！🌟', en: 'Every day is a new beginning, believe in yourself! 🌟' },
    { zh: '不要忘記記錄今天的心情哦 💭', en: "Don't forget to log your mood today 💭" },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');

    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { 
        text: t(randomResponse.zh, randomResponse.en), 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-24 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 shadow-lg hover:shadow-xl transition-shadow"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-40 right-6 w-80 h-96 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-4 text-white">
              <h3>{t('心靈小助手', 'Wellness Bot')} 💖</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  <p>{t('有什麼我可以幫你的嗎？', 'How can I help you today?')}</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('輸入訊息...', 'Type a message...')}
                className="flex-1 rounded-full"
              />
              <Button
                onClick={handleSend}
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-pink-400 to-purple-400"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
