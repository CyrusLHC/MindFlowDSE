import React from 'react';
import { motion } from 'motion/react';
import { Crown, Check, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';

const premiumPlans = [
  {
    id: 'lv1' as const,
    price: 100,
    zh: {
      title: 'Lv1',
      features: ['無廣告干擾', '更多選項或皮膚選項'],
    },
    en: {
      title: 'Lv1',
      features: ['No advertisement interference', 'More options or skin option'],
    },
    color: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'lv2' as const,
    price: 300,
    zh: {
      title: 'Lv2',
      features: ['無廣告干擾', '更多音樂選項或皮膚選項', '提供心理學家支持'],
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

interface PremiumPageProps {
  onBack?: () => void;
}

export function PremiumPage({ onBack }: PremiumPageProps) {
  const { t } = useLanguage();
  const { user, updateSubscription } = useUser();

  const handleSubscribe = (planId: 'lv1' | 'lv2') => {
    updateSubscription(planId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-purple-600">
          <Crown className="h-8 w-8" />
          <div>
            <p className="text-sm text-gray-500">
              {t('升級你的體驗', 'Upgrade your experience')}
            </p>
            <h1 className="text-2xl font-semibold">
              {t('Premium 服務方案', 'Premium Service Tiers')}
            </h1>
          </div>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('返回', 'Back')}
          </Button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide">{t('專屬優惠', 'Exclusive perks')}</p>
            <h2 className="text-3xl font-bold mt-1">{t('選擇你的 Premium 級別', 'Choose your Premium tier')}</h2>
            <p className="text-white/90 mt-2">
              {t('無廣告、更多客製化外觀、以及專業心理支持。', 'No ads, more personalization, and professional psychological support.')}
            </p>
          </div>
          {user?.subscriptionPlan && user.subscriptionPlan !== 'free' && (
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
              {t('當前方案', 'Current Plan')}: {user.subscriptionPlan.toUpperCase()}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {premiumPlans.map((plan, idx) => {
          const isCurrentPlan = user?.subscriptionPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-2xl p-6 shadow-lg border ${
                isCurrentPlan ? 'border-yellow-300' : 'border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">{t('方案', 'Plan')}</p>
                  <h3 className="text-2xl font-bold">{t(plan.zh.title, plan.en.title)}</h3>
                </div>
                <div className={`text-white rounded-full px-3 py-1 text-sm bg-gradient-to-r ${plan.color}`}>
                  ${plan.price}/{t('月', 'month')}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.zh.features.map((feature, featureIdx) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="bg-purple-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-sm text-gray-600">
                      {t(feature, plan.en.features[featureIdx])}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:opacity-90"
                disabled={isCurrentPlan}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isCurrentPlan
                  ? t('目前方案', 'Current Plan')
                  : user?.subscriptionPlan === 'free'
                  ? t('立即訂閱', 'Subscribe now')
                  : t('升級方案', 'Upgrade plan')}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {user?.subscriptionPlan === 'free' && (
        <div className="bg-white rounded-2xl p-4 border border-dashed border-purple-200 text-center text-sm text-gray-600">
          {t('你目前使用免費方案，可以升級獲取更多客製化體驗與支援。', 'You are currently on the Free plan. Upgrade to unlock more customization and support.')}
        </div>
      )}
    </div>
  );
}

