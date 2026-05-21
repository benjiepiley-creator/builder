import type { Category } from "@/constants/categories";
import type { AiReport } from "@/schemas/aiReportSchema";

export type ImageAsset = {
  id: string;
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
  fileSize?: number;
};

export type ScanInput = {
  category: Category | "";
  itemTitle: string;
  askingPrice?: number | null;
  location: string;
  listingDescription: string;
  sellerMessages: string;
  notes: string;
  images: ImageAsset[];
};

export type SavedScan = ScanInput & {
  id: string;
  createdAt: string;
  report: AiReport;
  thumbnailUri?: string;
};

export type ScanDraft = Partial<ScanInput>;
