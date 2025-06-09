// src/config.ts
/**
 * Frontend configuration for API base URL and CORS origins.
 *
 * - In development, defaults to http://localhost:4000
 * - In production, reads VITE_SERVER_URL from env
 */

const DEV_API = 'http://localhost:4000';
export const API_BASE: string =
  import.meta.env.PROD
    ? (import.meta.env.VITE_SERVER_URL as string)
    : DEV_API;

// Allowed origins for CORS.  Make sure your backend corsOptions.origin
// whitelist includes each of these.
export const ALLOWED_ORIGINS: Array<string | RegExp> = [
  'http://localhost:5173',
  'https://dentgo-b.onrender.com',
  // You can add additional prod domains via VITE_FRONTEND_PROD_DOMAINS
  ...(import.meta.env.VITE_FRONTEND_PROD_DOMAINS
    ? (import.meta.env.VITE_FRONTEND_PROD_DOMAINS as string)
        .split(',')
        .map((d) => new RegExp(`^https?://[\\w-]+\\${d}$`))
    : []),
];

// CORS options object to mirror backend settings if needed client-side
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    const ok = ALLOWED_ORIGINS.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    return ok
      ? callback(null, true)
      : callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// Cookie settings for client-side reference (backend must match)
const isProd = import.meta.env.PROD;
export const cookieConfig = {
  secure: isProd,
  httpOnly: (import.meta.env.VITE_COOKIE_HTTP_ONLY === 'true'),
  sameSite: 'none' as const,
  maxAge: Number(import.meta.env.VITE_COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 7,
  ...(isProd && import.meta.env.VITE_COOKIE_DOMAIN
    ? { domain: import.meta.env.VITE_COOKIE_DOMAIN as string }
    : {}),
};
