import { z } from "zod";

export const verdictSchema = z.enum(["LOOKS_SAFE", "CAUTION", "HIGH_RISK"]);
export const recommendationSchema = z.enum([
  "BUY",
  "NEGOTIATE",
  "ASK_MORE_QUESTIONS",
  "WALK_AWAY"
]);

export const aiReportSchema = z.object({
  overallRiskScore: z.number().min(0).max(100),
  verdict: verdictSchema,
  recommendation: recommendationSchema,
  summary: z.string().min(1),
  riskBreakdown: z.object({
    scamRisk: z.number().min(0).max(100),
    overpayRisk: z.number().min(0).max(100),
    hiddenDamageRisk: z.number().min(0).max(100),
    sellerTrustRisk: z.number().min(0).max(100),
    resaleRisk: z.number().min(0).max(100),
    urgencyRisk: z.number().min(0).max(100)
  }),
  redFlags: z.array(
    z.object({
      title: z.string().min(1),
      explanation: z.string().min(1),
      severity: z.enum(["low", "medium", "high"])
    })
  ),
  goodSigns: z.array(
    z.object({
      title: z.string().min(1),
      explanation: z.string().min(1)
    })
  ),
  estimatedValue: z.object({
    low: z.number().nullable(),
    fair: z.number().nullable(),
    high: z.number().nullable(),
    priceAssessment: z.string().min(1)
  }),
  questionsToAsk: z.array(z.string().min(1)),
  negotiation: z.object({
    suggestedOpeningOffer: z.number().nullable(),
    targetPrice: z.number().nullable(),
    maxRecommendedPrice: z.number().nullable(),
    politeScript: z.string().min(1),
    aggressiveScript: z.string().min(1),
    casualScript: z.string().min(1)
  }),
  finalRecommendation: z.string().min(1),
  confidenceScore: z.number().min(0).max(100)
});

export type AiReport = z.infer<typeof aiReportSchema>;
export type Verdict = z.infer<typeof verdictSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
