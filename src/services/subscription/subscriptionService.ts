import { create } from "zustand";

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
  upgradeVisible: boolean;
  canRunScan: () => boolean;
  registerScan: () => void;
  showUpgrade: () => void;
  hideUpgrade: () => void;
  setPlan: (plan: UserPlan) => void;
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  userPlan: "free",
  scansThisMonth: 0,
  upgradeVisible: false,
  canRunScan: () => {
    const { userPlan, scansThisMonth } = get();
    const limit = PLAN_CONFIG[userPlan].monthlyScanLimit;
    return limit === null || scansThisMonth < limit;
  },
  registerScan: () => set((state) => ({ scansThisMonth: state.scansThisMonth + 1 })),
  showUpgrade: () => set({ upgradeVisible: true }),
  hideUpgrade: () => set({ upgradeVisible: false }),
  setPlan: (plan) => set({ userPlan: plan, upgradeVisible: false })
}));
