import type { Verdict } from "@/schemas/aiReportSchema";

export const verdictLabel = (verdict: Verdict) => {
  switch (verdict) {
    case "LOOKS_SAFE":
      return "Looks Safe";
    case "CAUTION":
      return "Proceed With Caution";
    case "HIGH_RISK":
      return "High Risk / Walk Away";
  }
};

export const recommendationLabel = (recommendation: string) =>
  recommendation
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const verdictColor = (verdict: Verdict) => {
  switch (verdict) {
    case "LOOKS_SAFE":
      return "#22C55E";
    case "CAUTION":
      return "#F59E0B";
    case "HIGH_RISK":
      return "#EF4444";
  }
};

export const riskScoreColor = (score: number) => {
  if (score >= 70) return "#EF4444";
  if (score >= 40) return "#F59E0B";
  return "#22C55E";
};
