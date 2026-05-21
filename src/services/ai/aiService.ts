import { aiReportSchema, type AiReport } from "@/schemas/aiReportSchema";
import { AI_RESPONSE_CONTRACT, RISK_ANALYST_SYSTEM_PROMPT } from "@/services/ai/prompts";
import { buildMockReport } from "@/services/ai/mockReport";
import type { ScanInput } from "@/types/scan";
import { AppError, retry, wait } from "@/utils/network";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const MOCK_AI_SETTING = process.env.EXPO_PUBLIC_USE_MOCK_AI;
const USE_MOCK_AI = MOCK_AI_SETTING ? MOCK_AI_SETTING === "true" : !OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4o-mini";

const buildUserPrompt = (input: ScanInput) => `
Analyze this potential purchase.

Category: ${input.category}
Item title: ${input.itemTitle || "Not provided"}
Asking price: ${input.askingPrice ?? "Not provided"}
Location: ${input.location || "Not provided"}

Listing description:
${input.listingDescription || "Not provided"}

Seller messages:
${input.sellerMessages || "Not provided"}

User notes:
${input.notes || "Not provided"}

Images attached: ${input.images.length}

${AI_RESPONSE_CONTRACT}
`.trim();

const parseJsonResponse = (content: string): AiReport => {
  try {
    const cleaned = content
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
    return aiReportSchema.parse(JSON.parse(cleaned));
  } catch {
    throw new AppError("The AI response could not be validated. Try again or use mock mode.", "INVALID_AI_JSON");
  }
};

export const analyzePurchase = async (input: ScanInput): Promise<AiReport> => {
  if (USE_MOCK_AI) {
    await wait(1800);
    return buildMockReport(input);
  }

  const imageContent = input.images
    .filter((image) => image.base64)
    .slice(0, 6)
    .map((image) => ({
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${image.base64}`,
        detail: "low"
      }
    }));

  const response = await retry(async () => {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: RISK_ANALYST_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: buildUserPrompt(input) },
              ...imageContent
            ]
          }
        ]
      })
    });

    if (!result.ok) {
      throw new AppError("OpenAI analysis failed. Check your connection or API configuration.", "OPENAI_ERROR");
    }

    return result.json() as Promise<{
      choices?: { message?: { content?: string } }[];
    }>;
  }, 2);

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new AppError("OpenAI returned an empty analysis.", "OPENAI_ERROR");
  }

  return parseJsonResponse(content);
};
