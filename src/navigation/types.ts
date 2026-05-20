import type { SavedScan, ScanInput } from "@/types/scan";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  NewScan: undefined;
  Analysis: { input: ScanInput };
  RiskReport: { scanId?: string; scan?: SavedScan } | undefined;
  PastScans: undefined;
  Settings: undefined;
};
