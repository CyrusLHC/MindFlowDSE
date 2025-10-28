import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, User, Globe, LogOut, X, Ticket } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useUser();
  const [showVouchers, setShowVouchers] = useState(false);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-purple-500" />
                <h2>{t('設定', 'Settings')}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* User Profile */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-600">{t('用戶名稱', 'Username')}</p>
                    <p>{user?.name || 'User'}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('積分', 'Points')}</span>
                    <span className="text-purple-600">✨ {user?.points || 0}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">{t('角色', 'Role')}</span>
                    <span>{t(user?.role === 'student' ? '學生' : '家長', user?.role === 'student' ? 'Student' : 'Parent')}</span>
                  </div>
                </div>
              </motion.div>

              {/* My Vouchers */}
              {user?.role === 'student' && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={() => setShowVouchers(!showVouchers)}
                    variant="outline"
                    className="w-full"
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    {t('我的獎券', 'My Vouchers')} ({user?.vouchers?.length || 0})
                  </Button>
                  
                  {showVouchers && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-2 max-h-64 overflow-y-auto"
                    >
                      {user?.vouchers?.length === 0 ? (
                        <div className="text-center text-gray-400 py-4">
                          {t('還沒有獎券', 'No vouchers yet')}
                        </div>
                      ) : (
                        user?.vouchers?.map((voucher, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3 border border-purple-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{voucher.icon}</div>
                              <div className="flex-1">
                                <p className="text-sm">{t(voucher.name, voucher.nameEn)}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(voucher.redeemedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Language Selection */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-5 w-5" />
                  <span>{t('顯示語言', 'Display Language')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={language === 'zh' ? 'default' : 'outline'}
                    onClick={() => setLanguage('zh')}
                    className={language === 'zh' ? 'bg-gradient-to-r from-pink-400 to-purple-400' : ''}
                  >
                    中文
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-gradient-to-r from-pink-400 to-purple-400' : ''}
                  >
                    English
                  </Button>
                </div>
              </motion.div>

              {/* Logout */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('登出', 'Logout')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
