import { z } from "zod";

import { CATEGORIES } from "@/constants/categories";

const optionalMoney = z
  .union([z.number().positive(), z.nan(), z.null(), z.undefined()])
  .transform((value) => (typeof value === "number" && Number.isFinite(value) ? value : null));

export const scanInputSchema = z
  .object({
    category: z.enum(CATEGORIES, {
      error: "Choose a category"
    }),
    itemTitle: z.string().trim().optional().default(""),
    askingPrice: optionalMoney,
    location: z.string().trim().optional().default(""),
    listingDescription: z.string().trim().optional().default(""),
    sellerMessages: z.string().trim().optional().default(""),
    notes: z.string().trim().optional().default(""),
    images: z.array(
      z.object({
        id: z.string(),
        uri: z.string(),
        base64: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        fileSize: z.number().optional()
      })
    )
  })
  .superRefine((value, context) => {
    const hasText = Boolean(value.listingDescription || value.sellerMessages);
    const hasImage = value.images.length > 0;

    if (!hasText && !hasImage) {
      context.addIssue({
        code: "custom",
        path: ["listingDescription"],
        message: "Paste listing text, seller messages, or upload at least one image"
      });
    }
  });

export type ValidatedScanInput = z.infer<typeof scanInputSchema>;
