// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

// 1. Read environment
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';

// 2. Frontend origins (you can add more, or use regex for Vercel)
const LOCALHOST = 'http://localhost:5173';
const STAGING  = 'https://dentgo-b.onrender.com';
const PROD_DOMAINS = process.env.FRONTEND_PROD_DOMAINS
  ? process.env.FRONTEND_PROD_DOMAINS.split(',')  // e.g. ".myapp.com,.otherapp.com"
  : [] as string[];

export const ALLOWED_ORIGINS: Array<string|RegExp> = [
  LOCALHOST,
  STAGING,
  // allow any subdomain of your production domains:
  ...PROD_DOMAINS.map(d => new RegExp(`^https?://[\\w-]+\\${d}$`)),
];

// 3. CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow REST clients or same-host (no origin)
    if (!origin) return callback(null, true);

    const isAllowed = ALLOWED_ORIGINS.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );

    return isAllowed
      ? callback(null, true)
      : callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// 4. Cookie configuration
const isProd = NODE_ENV === 'production';
export const cookieConfig = {
  // only send over HTTPS in prod
  secure: isProd,
  // only JS-inaccessible if you want httpOnly
  httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
  sameSite: 'none' as const,
  maxAge: Number(process.env.COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 7,
  // only set a broad domain in true production:
  ...(isProd && process.env.COOKIE_DOMAIN
    ? { domain: process.env.COOKIE_DOMAIN }
    : {}),
};
