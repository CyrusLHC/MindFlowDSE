import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, ShoppingBag, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../lib/language-context';
import { useUser, Voucher } from '../lib/user-context';
import { toast } from 'sonner@2.0.3';

const rewards = [
  { id: 1, zh: '星巴克咖啡券', en: 'Starbucks Coffee Voucher', points: 250, icon: '☕', available: 50, color: 'from-green-400 to-emerald-400' },
  { id: 2, zh: '書店折扣券', en: 'Bookstore Discount', points: 200, icon: '📚', available: 50, color: 'from-blue-400 to-cyan-400' },
  { id: 3, zh: '文具套裝', en: 'Stationery Set', points: 250, icon: '✏️', available: 50, color: 'from-yellow-400 to-orange-400' },
  { id: 4, zh: '與導師資諮詢服務（15分鐘）', en: 'Consultation with Teacher (15 minutes)', points: 700, icon: '👨‍🏫', available: 30, color: 'from-red-400 to-pink-400' },
  { id: 5, zh: '與導師資諮詢服務（30分鐘）', en: 'Consultation with Teacher (30 minutes)', points: 1000, icon: '👨‍🏫', available: 30, color: 'from-orange-400 to-red-400' },
  { id: 6, zh: '與導師資諮詢服務（60分鐘）', en: 'Consultation with Teacher (60 minutes)', points: 1500, icon: '👨‍🏫', available: 30, color: 'from-pink-400 to-purple-400' },
];

export function RewardsShop() {
  const [rewardStock, setRewardStock] = useState<{ [key: number]: number }>(
    rewards.reduce((acc, r) => ({ ...acc, [r.id]: r.available }), {})
  );
  const [redeemedItems, setRedeemedItems] = useState<number[]>([]);
  const [selectedReward, setSelectedReward] = useState<typeof rewards[0] | null>(null);
  const { t } = useLanguage();
  const { user, deductPoints, addVoucher } = useUser();

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (!user || user.points < reward.points) {
      toast.error(t('積分不足！', 'Insufficient points!'));
      return;
    }

    if (rewardStock[reward.id] <= 0) {
      toast.error(t('已售罄！', 'Out of stock!'));
      return;
    }

    deductPoints(reward.points);
    setRewardStock(prev => ({ ...prev, [reward.id]: prev[reward.id] - 1 }));
    setRedeemedItems(prev => [...prev, reward.id]);
    
    // Add voucher to user's collection
    const voucher: Voucher = {
      id: reward.id,
      name: reward.zh,
      nameEn: reward.en,
      icon: reward.icon,
      redeemedAt: new Date(),
    };
    addVoucher(voucher);
    
    setSelectedReward(null);
    toast.success(t('兌換成功！', 'Redeemed successfully!'));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-6 text-white text-center"
      >
        <ShoppingBag className="h-12 w-12 mx-auto mb-2" />
        <h2>{t('積分商店', 'Rewards Shop')}</h2>
        <p className="mt-2">{t('你的積分', 'Your Points')}: ✨ {user?.points || 0}</p>
      </motion.div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {rewards.map((reward, idx) => {
          const stock = rewardStock[reward.id];
          const isRedeemed = redeemedItems.includes(reward.id);

          return (
            <motion.button
              key={reward.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedReward(reward)}
              className={`bg-gradient-to-br ${reward.color} rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all relative`}
            >
              {stock <= 0 && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <span>{t('已售罄', 'Sold Out')}</span>
                </div>
              )}
              
              {isRedeemed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              )}

              <div className="text-4xl mb-2">{reward.icon}</div>
              <div className="text-sm mb-1">{t(reward.zh, reward.en)}</div>
              <div className="text-xs opacity-90">✨ {reward.points}</div>
              <div className="text-xs opacity-75 mt-1">{t('剩餘', 'Left')}: {stock}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Redeem Dialog */}
      <AnimatePresence>
        {selectedReward && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReward(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 z-50 max-w-sm w-full mx-4"
            >
              <div className={`bg-gradient-to-br ${selectedReward.color} rounded-2xl p-6 text-white text-center mb-6`}>
                <div className="text-6xl mb-3">{selectedReward.icon}</div>
                <h3>{t(selectedReward.zh, selectedReward.en)}</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('所需積分', 'Required Points')}</span>
                  <span>✨ {selectedReward.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('你的積分', 'Your Points')}</span>
                  <span className={user && user.points >= selectedReward.points ? 'text-green-600' : 'text-red-600'}>
                    ✨ {user?.points || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('剩餘數量', 'Stock')}</span>
                  <span>{rewardStock[selectedReward.id]}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReward(null)}
                  className="flex-1"
                >
                  {t('取消', 'Cancel')}
                </Button>
                <Button
                  onClick={() => handleRedeem(selectedReward)}
                  disabled={!user || user.points < selectedReward.points || rewardStock[selectedReward.id] <= 0}
                  className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  {t('兌換', 'Redeem')}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
