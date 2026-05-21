import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserPlan = "free" | "pro" | "premium";

export type PlanConfig = {
  name: string;
  monthlyScanLimit: number | null;
  features: string[];
};

export const PLAN_CONFIG: Record<UserPlan, PlanConfig> = {
  free: {
    name: "Free",
    monthlyScanLimit: 3,
    features: ["3 scans per month", "Basic risk score", "Basic summary"]
  },
  pro: {
    name: "Pro",
    monthlyScanLimit: null,
    features: ["Unlimited scans", "Full report", "Negotiation scripts", "Saved history"]
  },
  premium: {
    name: "Premium",
    monthlyScanLimit: null,
    features: ["Everything in Pro", "Better deal finder placeholder", "PDF/export placeholder", "Priority AI model placeholder"]
  }
};

type SubscriptionState = {
  userPlan: UserPlan;
  scansThisMonth: number;
  monthKey: string;
  upgradeVisible: boolean;
  canRunScan: () => boolean;
  registerScan: () => void;
  showUpgrade: () => void;
  hideUpgrade: () => void;
  setPlan: (plan: UserPlan) => void;
};

const getMonthKey = () => new Date().toISOString().slice(0, 7);

const resetIfNewMonth = (state: SubscriptionState) => {
  const currentMonth = getMonthKey();
  if (state.monthKey === currentMonth) return state;
  return { ...state, scansThisMonth: 0, monthKey: currentMonth };
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      userPlan: "free",
      scansThisMonth: 0,
      monthKey: getMonthKey(),
      upgradeVisible: false,
      canRunScan: () => {
        const current = resetIfNewMonth(get());
        if (current.monthKey !== get().monthKey) {
          set({ scansThisMonth: current.scansThisMonth, monthKey: current.monthKey });
        }
        const limit = PLAN_CONFIG[current.userPlan].monthlyScanLimit;
        return limit === null || current.scansThisMonth < limit;
      },
      registerScan: () =>
        set((state) => {
          const current = resetIfNewMonth(state);
          return {
            scansThisMonth: current.scansThisMonth + 1,
            monthKey: current.monthKey
          };
        }),
      showUpgrade: () => set({ upgradeVisible: true }),
      hideUpgrade: () => set({ upgradeVisible: false }),
      setPlan: (plan) => set({ userPlan: plan, upgradeVisible: false })
    }),
    {
      name: "riskradar.subscription.v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userPlan: state.userPlan,
        scansThisMonth: state.scansThisMonth,
        monthKey: state.monthKey
      })
    }
  )
);
