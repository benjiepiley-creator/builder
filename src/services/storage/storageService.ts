import AsyncStorage from "@react-native-async-storage/async-storage";

import { savedScanSchema } from "@/schemas/savedScanSchema";
import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import type { SavedScan } from "@/types/scan";
import { AppError } from "@/utils/network";

const LOCAL_SCANS_KEY = "riskradar.scans.v1";

export type ScanStorage = {
  saveScan: (scan: SavedScan) => Promise<void>;
  getScans: () => Promise<SavedScan[]>;
  getScanById: (id: string) => Promise<SavedScan | null>;
  deleteScan: (id: string) => Promise<void>;
  clearScans: () => Promise<void>;
};

export const sanitizeScanForPersistence = (scan: SavedScan): SavedScan => ({
  ...scan,
  images: scan.images.map((image) => ({
    id: image.id,
    uri: image.uri,
    width: image.width,
    height: image.height,
    fileSize: image.fileSize
  }))
});

const readLocalScans = async (): Promise<SavedScan[]> => {
  const raw = await AsyncStorage.getItem(LOCAL_SCANS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const scans = parsed
      .map((item) => savedScanSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => sanitizeScanForPersistence(result.data));

    if (scans.length !== parsed.length) {
      await AsyncStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(scans));
    }

    return scans;
  } catch {
    await AsyncStorage.removeItem(LOCAL_SCANS_KEY);
    return [];
  }
};

export const localScanStorage: ScanStorage = {
  async saveScan(scan) {
    const scans = await readLocalScans();
    const persistedScan = sanitizeScanForPersistence(scan);
    const next = [persistedScan, ...scans.filter((item) => item.id !== scan.id)].slice(0, 75);
    await AsyncStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(next));
  },
  async getScans() {
    return readLocalScans();
  },
  async getScanById(id) {
    const scans = await readLocalScans();
    return scans.find((scan) => scan.id === id) ?? null;
  },
  async deleteScan(id) {
    const scans = await readLocalScans();
    await AsyncStorage.setItem(
      LOCAL_SCANS_KEY,
      JSON.stringify(scans.filter((scan) => scan.id !== id))
    );
  },
  async clearScans() {
    await AsyncStorage.removeItem(LOCAL_SCANS_KEY);
  }
};

export const supabaseScanStorage: ScanStorage = {
  async saveScan(scan) {
    if (!isSupabaseConfigured || !supabase) {
      throw new AppError("Supabase is not configured.", "SUPABASE_NOT_CONFIGURED");
    }

    const { error } = await supabase.from("scans").upsert({
      id: scan.id,
      user_id: null,
      category: scan.category,
      item_title: scan.itemTitle,
      asking_price: scan.askingPrice,
      location: scan.location,
      listing_description: scan.listingDescription,
      seller_messages: scan.sellerMessages,
      notes: scan.notes,
      overall_risk_score: scan.report.overallRiskScore,
      verdict: scan.report.verdict,
      recommendation: scan.report.recommendation,
      ai_report: scan.report,
      created_at: scan.createdAt
    });

    if (error) throw new AppError(error.message, "STORAGE_ERROR");

    if (scan.images.length > 0) {
      await supabase.from("scan_images").delete().eq("scan_id", scan.id);
      const { error: imageError } = await supabase.from("scan_images").insert(
        scan.images.map((image) => ({
          scan_id: scan.id,
          image_url: image.uri
        }))
      );
      if (imageError) throw new AppError(imageError.message, "STORAGE_ERROR");
    }
  },
  async getScans() {
    if (!isSupabaseConfigured || !supabase) {
      throw new AppError("Supabase is not configured.", "SUPABASE_NOT_CONFIGURED");
    }
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new AppError(error.message, "STORAGE_ERROR");

    return (data ?? []).map((row) => ({
      id: row.id,
      category: row.category,
      itemTitle: row.item_title,
      askingPrice: row.asking_price,
      location: row.location ?? "",
      listingDescription: row.listing_description ?? "",
      sellerMessages: row.seller_messages ?? "",
      notes: row.notes ?? "",
      images: [],
      report: row.ai_report,
      createdAt: row.created_at
    })) as SavedScan[];
  },
  async getScanById(id) {
    const scans = await this.getScans();
    return scans.find((scan) => scan.id === id) ?? null;
  },
  async deleteScan(id) {
    if (!isSupabaseConfigured || !supabase) {
      throw new AppError("Supabase is not configured.", "SUPABASE_NOT_CONFIGURED");
    }
    const { error } = await supabase.from("scans").delete().eq("id", id);
    if (error) throw new AppError(error.message, "STORAGE_ERROR");
  },
  async clearScans() {
    if (!isSupabaseConfigured || !supabase) {
      throw new AppError("Supabase is not configured.", "SUPABASE_NOT_CONFIGURED");
    }
    const { error } = await supabase.from("scans").delete().neq("id", "");
    if (error) throw new AppError(error.message, "STORAGE_ERROR");
  }
};

export const scanStorage: ScanStorage = localScanStorage;
