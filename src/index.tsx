// src/index.tsx
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

// Create a single QueryClient instance for the app
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Provide the react-query client to the entire app */}
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StripeProvider>
          <DarkModeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </DarkModeProvider>
        </StripeProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
