import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [parentCode, setParentCode] = useState('');
  const { t } = useLanguage();
  const { login } = useUser();

  const handleLogin = () => {
    if (email && password) {
      if (role === 'parent' && parentCode !== '123456') {
        alert(t('家長密碼錯誤', 'Incorrect parent code'));
        return;
      }
      login(email, role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Cute Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block text-6xl mb-4"
          >
            <Heart className="h-16 w-16 text-pink-500 fill-pink-500 inline" />
          </motion.div>
          <h1 className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {t('心流考生', 'MindFlow DSE')}
          </h1>
          <p className="text-gray-600 mt-2">{t('專注學習・放鬆身心・成就夢想', 'Focus, Relax, Achieve')}</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6"
        >
          {/* Email Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4" />
              {t('學校電郵', 'School Email')}
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.edu"
              className="rounded-xl border-2 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700">
              <Lock className="h-4 w-4" />
              {t('密碼', 'Password')}
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border-2 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700">
              <User className="h-4 w-4" />
              {t('選擇角色', 'Select Role')}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setRole('student')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === 'student'
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="text-2xl mb-1">🎓</div>
                <div>{t('學生', 'Student')}</div>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setRole('parent')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === 'parent'
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-200'
                }`}
              >
                <div className="text-2xl mb-1">👨‍👩‍👧‍👦</div>
                <div>{t('家長', 'Parent')}</div>
              </motion.button>
            </div>
          </div>

          {/* Parent Code Input */}
          {role === 'parent' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label className="text-gray-700">
                {t('家長驗證碼', 'Parent Verification Code')}
              </Label>
              <Input
                type="password"
                value={parentCode}
                onChange={(e) => setParentCode(e.target.value)}
                placeholder={t('請輸入家長密碼', 'Enter parent code')}
                className="rounded-xl border-2 border-pink-200 focus:border-pink-400"
              />
              <p className="text-xs text-gray-500">{t('提示：演示密碼為 123456', 'Hint: Demo code is 123456')}</p>
            </motion.div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl"
          >
            {t('登入', 'Login')} ✨
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 text-4xl opacity-50"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-40 right-20 text-3xl opacity-50"
        >
          ⭐
        </motion.div>
      </motion.div>
    </div>
  );
}
