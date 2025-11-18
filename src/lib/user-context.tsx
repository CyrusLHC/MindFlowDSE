import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Voucher {
  id: number;
  name: string;
  nameEn: string;
  icon: string;
  redeemedAt: Date;
}

interface UserData {
  email: string;
  role: 'student' | 'parent';
  name: string;
  points: number;
  vouchers: Voucher[];
  subscriptionPlan: 'free' | 'lv1' | 'lv2';
}

interface UserContextType {
  user: UserData | null;
  login: (email: string, role: 'student' | 'parent') => void;
  logout: () => void;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => void;
  addVoucher: (voucher: Voucher) => void;
  updateSubscription: (plan: 'lv1' | 'lv2') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const login = (email: string, role: 'student' | 'parent') => {
    const name = email.split('@')[0];
    setUser({
      email,
      role,
      name,
      points: 500, // Starting points
      vouchers: [],
      subscriptionPlan: 'free',
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addPoints = (points: number) => {
    setUser(prev => prev ? { ...prev, points: prev.points + points } : null);
  };

  const deductPoints = (points: number) => {
    setUser(prev => prev ? { ...prev, points: Math.max(0, prev.points - points) } : null);
  };

  const addVoucher = (voucher: Voucher) => {
    setUser(prev => prev ? { ...prev, vouchers: [...prev.vouchers, voucher] } : null);
  };

  const updateSubscription = (plan: 'lv1' | 'lv2') => {
    setUser(prev => prev ? { ...prev, subscriptionPlan: plan } : null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, addPoints, deductPoints, addVoucher, updateSubscription }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
