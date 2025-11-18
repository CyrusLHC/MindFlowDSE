import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';

export function PremiumSubscription() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { user, updateSubscription } = useUser();

  const plans = [
    {
      id: 'lv1' as const,
      price: 100,
      zh: {
        title: 'Lv1',
        features: [
          '無廣告干擾',
          '更多選項或皮膚選項',
        ],
      },
      en: {
        title: 'Lv1',
        features: [
          'No advertisement interference',
          'More options or skin option',
        ],
      },
      color: 'from-blue-400 to-cyan-400',
    },
    {
      id: 'lv2' as const,
      price: 300,
      zh: {
        title: 'Lv2',
        features: [
          '無廣告干擾',
          '更多音樂選項或皮膚選項',
          '提供心理學家支持',
        ],
      },
      en: {
        title: 'Lv2',
        features: [
          'No advertisement interference',
          'More music options or skin option',
          'Provide psychologists support',
        ],
      },
      color: 'from-purple-400 to-pink-400',
    },
  ];

  const handleSubscribe = (planId: 'lv1' | 'lv2') => {
    updateSubscription(planId);
    setIsOpen(false);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-40 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Crown className="h-6 w-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl z-50 p-6 max-w-2xl w-[90vw] max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold">
                    {t('高級服務層級', 'Premium Service Tiers')}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6 text-center text-gray-600">
                <p className="text-sm">
                  {t('選擇適合您的訂閱計劃', 'Choose the subscription plan that suits you')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {plans.map((plan) => {
                  const isCurrentPlan = user?.subscriptionPlan === plan.id;
                  const isSubscribed = user?.subscriptionPlan && user.subscriptionPlan !== 'free';

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`bg-gradient-to-br ${plan.color} rounded-2xl p-6 text-white relative ${
                        isCurrentPlan ? 'ring-4 ring-yellow-400 ring-offset-2' : ''
                      }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-black rounded-full px-3 py-1 text-xs font-bold">
                          {t('當前計劃', 'Current Plan')}
                        </div>
                      )}
                      <h3 className="text-2xl font-bold mb-2">
                        {t(plan.zh.title, plan.en.title)}
                      </h3>
                      <div className="text-3xl font-bold mb-4">
                        ${plan.price}
                        <span className="text-lg opacity-90">
                          /{t('月', 'month')}
                        </span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.zh.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 shrink-0 mt-0.5" />
                            <span>{t(feature, plan.en.features[idx])}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isCurrentPlan}
                        className={`w-full ${
                          isCurrentPlan
                            ? 'bg-white/20 cursor-not-allowed'
                            : 'bg-white text-purple-600 hover:bg-white/90'
                        }`}
                      >
                        {isCurrentPlan
                          ? t('當前計劃', 'Current Plan')
                          : user?.subscriptionPlan === 'free'
                          ? t('訂閱', 'Subscribe')
                          : t('升級', 'Upgrade')}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {user?.subscriptionPlan === 'free' && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">
                    {t('目前使用免費計劃', 'Currently using Free plan')}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

