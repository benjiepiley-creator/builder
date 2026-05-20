export class AppError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "OPENAI_ERROR"
      | "INVALID_AI_JSON"
      | "MISSING_INPUT"
      | "IMAGE_UPLOAD_FAILED"
      | "SUBSCRIPTION_LIMIT"
      | "SUPABASE_NOT_CONFIGURED"
      | "STORAGE_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  attempts = 2,
  delayMs = 600
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) {
      throw error;
    }
    await wait(delayMs);
    return retry(fn, attempts - 1, delayMs * 1.8);
  }
};
