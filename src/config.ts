// src/config.ts

// 1. Detect whether we’re running in dev mode
export const DEV = import.meta.env.DEV;

/**
 * 2. Backend base URL
 *    - Development: http://localhost:4000
 *    - Production: VITE_SERVER_URL
 */
export const API_BASE: string = DEV
  ? 'http://localhost:4000'
  : (import.meta.env.VITE_SERVER_URL as string);

/**
 * 3. Google Client ID (used in Login.tsx)
 */
export const GOOGLE_CLIENT_ID: string =
  import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

/**
 * 4. Stripe Publishable Key
 */
export const STRIPE_PK: string =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

/**
 * 5. Free messages per day for Basic plan
 */
const FREE_MESSAGES_RAW = import.meta.env.VITE_FREE_MESSAGES_PER_DAY;
export const FREE_MESSAGES_PER_DAY: number = Number.isNaN(Number(FREE_MESSAGES_RAW))
  ? 1
  : parseInt(FREE_MESSAGES_RAW as string, 10);

/**
 * 6. Frontend allowed origins (for CORS or embed checks)
 */
const PROD_DOMAINS = import.meta.env.VITE_FRONTEND_PROD_DOMAINS
  ? (import.meta.env.VITE_FRONTEND_PROD_DOMAINS as string).split(',')
  : [];

export const ALLOWED_ORIGINS: Array<string | RegExp> = [
  // Dev host
  'http://localhost:5173',
  // Primary prod frontend
  (import.meta.env.VITE_SERVER_URL as string),
  // Additional domains
  ...PROD_DOMAINS.map(
    (d) =>
      new RegExp(
        `^https?://[\\w-]+\\.${d.replace(/^\.*|\.*$/g, '')}$`
      )
  ),
];
