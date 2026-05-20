import { create } from "zustand";

import { analyzePurchase } from "@/services/ai/aiService";
import { scanStorage } from "@/services/storage/storageService";
import { useSubscriptionStore } from "@/services/subscription/subscriptionService";
import type { SavedScan, ScanInput } from "@/types/scan";
import { createId } from "@/utils/id";
import { AppError } from "@/utils/network";

type ScanState = {
  scans: SavedScan[];
  currentScan: SavedScan | null;
  isAnalyzing: boolean;
  isLoading: boolean;
  error: string | null;
  loadScans: () => Promise<void>;
  runAnalysis: (input: ScanInput) => Promise<SavedScan>;
  saveReport: (scan: SavedScan) => Promise<void>;
  deleteScan: (id: string) => Promise<void>;
  clearLocalData: () => Promise<void>;
  setCurrentScan: (scan: SavedScan | null) => void;
};

export const useScanStore = create<ScanState>((set, get) => ({
  scans: [],
  currentScan: null,
  isAnalyzing: false,
  isLoading: false,
  error: null,
  async loadScans() {
    set({ isLoading: true, error: null });
    try {
      const scans = await scanStorage.getScans();
      set({ scans, isLoading: false });
    } catch {
      set({ error: "Unable to load saved scans.", isLoading: false });
    }
  },
  async runAnalysis(input) {
    const subscription = useSubscriptionStore.getState();
    if (!subscription.canRunScan()) {
      subscription.showUpgrade();
      throw new AppError("You have reached the free monthly scan limit.", "SUBSCRIPTION_LIMIT");
    }

    set({ isAnalyzing: true, error: null });
    try {
      const report = await analyzePurchase(input);
      const savedScan: SavedScan = {
        ...input,
        id: createId(),
        createdAt: new Date().toISOString(),
        report,
        thumbnailUri: input.images[0]?.uri
      };
      await scanStorage.saveScan(savedScan);
      subscription.registerScan();
      set((state) => ({
        currentScan: savedScan,
        scans: [savedScan, ...state.scans.filter((scan) => scan.id !== savedScan.id)],
        isAnalyzing: false
      }));
      return savedScan;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Risk analysis failed.";
      set({ error: message, isAnalyzing: false });
      throw error;
    }
  },
  async saveReport(scan) {
    await scanStorage.saveScan(scan);
    set((state) => ({
      scans: [scan, ...state.scans.filter((item) => item.id !== scan.id)]
    }));
  },
  async deleteScan(id) {
    await scanStorage.deleteScan(id);
    set((state) => ({
      scans: state.scans.filter((scan) => scan.id !== id),
      currentScan: state.currentScan?.id === id ? null : state.currentScan
    }));
  },
  async clearLocalData() {
    await scanStorage.clearScans();
    set({ scans: [], currentScan: null });
  },
  setCurrentScan(scan) {
    set({ currentScan: scan });
  }
}));
