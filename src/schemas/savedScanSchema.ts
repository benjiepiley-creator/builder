import { z } from "zod";

import { CATEGORIES } from "@/constants/categories";
import { aiReportSchema } from "@/schemas/aiReportSchema";

export const imageAssetSchema = z.object({
  id: z.string(),
  uri: z.string(),
  base64: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  fileSize: z.number().optional()
});

export const savedScanSchema = z.object({
  id: z.string(),
  category: z.enum(CATEGORIES),
  itemTitle: z.string(),
  askingPrice: z.number().nullable().optional(),
  location: z.string(),
  listingDescription: z.string(),
  sellerMessages: z.string(),
  notes: z.string(),
  images: z.array(imageAssetSchema),
  createdAt: z.string(),
  report: aiReportSchema,
  thumbnailUri: z.string().optional()
});
