import type { AiReport } from "@/schemas/aiReportSchema";
import type { ScanInput } from "@/types/scan";

export const buildMockReport = (input: ScanInput): AiReport => {
  const price = input.askingPrice ?? 1850;
  const hasImages = input.images.length > 0;
  const isRental = input.category === "Rental Listings";
  const isCar = input.category === "Used Cars";

  return {
    overallRiskScore: isRental ? 72 : 48,
    verdict: isRental ? "HIGH_RISK" : "CAUTION",
    recommendation: isRental ? "WALK_AWAY" : "NEGOTIATE",
    summary: `Based on the provided information, this ${input.category || "item"} shows a mixed risk profile. The listing has enough detail to continue evaluating, but the seller should provide verifiable proof before you send money or commit.`,
    riskBreakdown: {
      scamRisk: isRental ? 82 : 42,
      overpayRisk: 58,
      hiddenDamageRisk: hasImages ? 45 : 64,
      sellerTrustRisk: 55,
      resaleRisk: 38,
      urgencyRisk: isRental ? 76 : 44
    },
    redFlags: [
      {
        title: "Verification gaps",
        explanation:
          "The seller has not yet provided enough independent proof, receipts, serial/VIN information, or inspection evidence to reduce risk.",
        severity: "medium"
      },
      {
        title: "Price needs market validation",
        explanation:
          "The asking price may be reasonable, but RiskRadar needs comparable listings and condition proof before treating it as a strong deal.",
        severity: "medium"
      },
      ...(isRental
        ? [
            {
              title: "Rental payment risk",
              explanation:
                "Do not pay deposits or application fees before an in-person or verified video viewing and proof that the person controls the property.",
              severity: "high" as const
            }
          ]
        : [])
    ],
    goodSigns: [
      {
        title: "Enough detail to ask targeted questions",
        explanation:
          "The listing gives enough context to ask for specific verification instead of negotiating blindly."
      },
      {
        title: hasImages ? "Images are available" : "Text can be evaluated",
        explanation: hasImages
          ? "Photos can help identify visible condition issues, although professional inspection is still recommended."
          : "The pasted text gives a starting point, but photos would improve confidence."
      }
    ],
    estimatedValue: {
      low: Math.round(price * 0.78),
      fair: Math.round(price * 0.9),
      high: Math.round(price * 1.05),
      priceAssessment:
        "The asking price appears slightly high based on the risk signals. Use verification gaps as leverage before agreeing."
    },
    questionsToAsk: [
      isCar ? "Can you provide the VIN, title status, maintenance records, and accident history?" : "Can you provide proof of ownership or purchase?",
      "Why are you selling, and how long have you owned it?",
      "Are there any defects, repairs, missing parts, liens, or issues not shown in the photos?",
      "Can I inspect and test it in person before payment?",
      "Will you accept a secure payment method and meet in a safe public location?",
      "Can you send current photos or video with today's date visible?"
    ],
    negotiation: {
      suggestedOpeningOffer: Math.round(price * 0.75),
      targetPrice: Math.round(price * 0.84),
      maxRecommendedPrice: Math.round(price * 0.92),
      politeScript: `Thanks for the details. Based on the missing verification and current market comps, would you consider ${Math.round(price * 0.75)} if everything checks out in person?`,
      aggressiveScript: `Given the verification gaps and risk I would be taking on, my best offer is ${Math.round(price * 0.72)} after inspection.`,
      casualScript: `I like it, but I need to verify a few things first. If it checks out, could you do ${Math.round(price * 0.8)}?`
    },
    finalRecommendation: isRental
      ? "Walk away unless the seller verifies control of the property, allows a viewing, and uses a legitimate lease process with no pressure payment."
      : "Proceed only if the seller provides proof, allows inspection/testing, and accepts a safer negotiation price.",
    confidenceScore: hasImages ? 72 : 61
  };
};
