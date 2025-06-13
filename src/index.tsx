import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry at the very top before any other imports
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN as string,
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', /^\//],
    }),
  ],
  tracesSampleRate: 1.0,
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { DarkModeProvider } from '@components/DarkModeContext';
import { AuthProvider } from '@context/AuthContext';
import { StripeProvider } from '@context/StripeContext';
import { ToastProvider } from '@components/ui/ToastProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <StripeProvider>
              <DarkModeProvider>
                <App />
              </DarkModeProvider>
            </StripeProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// Report web vitals through Sentry
reportWebVitals((metric) => {
  Sentry.captureMessage(
    `Web Vitals: ${metric.name} = ${metric.value.toFixed(2)} ms`,
    {
      level: 'info',
      tags: { category: 'web-vitals' },
    }
  );
});
