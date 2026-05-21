const createFallbackUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });

export const createUuid = () => {
  const randomUuid = globalThis.crypto?.randomUUID?.();
  return randomUuid ?? createFallbackUuid();
};

export const createId = (prefix?: string) => {
  const uuid = createUuid();
  return prefix ? `${prefix}_${uuid}` : uuid;
};
