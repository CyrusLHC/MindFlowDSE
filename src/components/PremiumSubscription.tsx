import React from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../lib/language-context';

interface PremiumSubscriptionProps {
  onOpen: () => void;
}

export function PremiumSubscription({ onOpen }: PremiumSubscriptionProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      className="fixed bottom-40 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Button
        onClick={onOpen}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg hover:shadow-xl transition-shadow"
        title={t('開啟 Premium 訂閱', 'Open Premium Subscription')}
      >
        <Crown className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}

