export const API_BASE = import.meta.env.VITE_SERVER_URL ?? "";
export const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
export default { API_BASE, STRIPE_PK, GOOGLE_CLIENT_ID };
