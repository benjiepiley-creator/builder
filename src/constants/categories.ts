export const CATEGORIES = [
  "Used Cars",
  "Electronics",
  "Furniture",
  "Watches / Jewelry",
  "Sneakers / Collectibles",
  "Rental Listings",
  "Contractor Quotes",
  "General Marketplace Item"
] as const;

export type Category = (typeof CATEGORIES)[number];
