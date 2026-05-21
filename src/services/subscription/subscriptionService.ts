import AsyncStorage from "@react-native-async-storage/async-storage";
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
  monthKey: string;
  upgradeVisible: boolean;
  canRunScan: () => boolean;
  registerScan: () => void;
  showUpgrade: () => void;
  hideUpgrade: () => void;
  setPlan: (plan: UserPlan) => void;
};

type PersistedSubscriptionState = Pick<SubscriptionState, "userPlan" | "scansThisMonth" | "monthKey">;

const SUBSCRIPTION_KEY = "riskradar.subscription.v1";
const getMonthKey = () => new Date().toISOString().slice(0, 7);

const isUserPlan = (value: unknown): value is UserPlan =>
  value === "free" || value === "pro" || value === "premium";

const resetIfNewMonth = (state: SubscriptionState) => {
  const currentMonth = getMonthKey();
  if (state.monthKey === currentMonth) return state;
  return { ...state, scansThisMonth: 0, monthKey: currentMonth };
};

const persistSubscription = async (state: PersistedSubscriptionState) => {
  try {
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(state));
  } catch {
    // Subscription state is a convenience cache; scan gating still works in memory.
  }
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  userPlan: "free",
  scansThisMonth: 0,
  monthKey: getMonthKey(),
  upgradeVisible: false,
  canRunScan: () => {
    const current = resetIfNewMonth(get());
    if (current.monthKey !== get().monthKey) {
      const next = { scansThisMonth: current.scansThisMonth, monthKey: current.monthKey };
      set(next);
      void persistSubscription({
        userPlan: current.userPlan,
        scansThisMonth: next.scansThisMonth,
        monthKey: next.monthKey
      });
    }
    const limit = PLAN_CONFIG[current.userPlan].monthlyScanLimit;
    return limit === null || current.scansThisMonth < limit;
  },
  registerScan: () =>
    set((state) => {
      const current = resetIfNewMonth(state);
      const next = {
        scansThisMonth: current.scansThisMonth + 1,
        monthKey: current.monthKey
      };
      void persistSubscription({
        userPlan: current.userPlan,
        scansThisMonth: next.scansThisMonth,
        monthKey: next.monthKey
      });
      return next;
    }),
  showUpgrade: () => set({ upgradeVisible: true }),
  hideUpgrade: () => set({ upgradeVisible: false }),
  setPlan: (plan) => {
    const state = get();
    set({ userPlan: plan, upgradeVisible: false });
    void persistSubscription({
      userPlan: plan,
      scansThisMonth: state.scansThisMonth,
      monthKey: state.monthKey
    });
  }
}));

AsyncStorage.getItem(SUBSCRIPTION_KEY)
  .then((raw) => {
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<PersistedSubscriptionState>;
    if (!isUserPlan(parsed.userPlan)) return;

    const monthKey = parsed.monthKey === getMonthKey() ? parsed.monthKey : getMonthKey();
    useSubscriptionStore.setState({
      userPlan: parsed.userPlan,
      scansThisMonth: parsed.monthKey === monthKey && typeof parsed.scansThisMonth === "number" ? parsed.scansThisMonth : 0,
      monthKey
    });
  })
  .catch(() => undefined);
