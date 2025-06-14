// pages/Login.tsx – re-worked Google sign-in flow with graceful fallback

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Loader from '@components/ui/Loader';
import logo from '@/assets/images/logo-w.png';
import AppleIcon from '@/assets/images/Icon-apple.png';
import GoogleIcon from '@/assets/images/Icon-google.png';
import dentaiBottom from '@/assets/images/dentai-bottom.svg';
import { GOOGLE_CLIENT_ID, API_BASE } from '@/config';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

// --- Local helpers ---------------------------------------------------------

/**
 * Trigger Google One-Tap / Popup sign-in *or* gracefully fall back to
 * traditional OAuth redirect when the One-Tap UI is suppressed (e.g. because
 * of iOS restrictions, user closed it recently, or third-party-cookie blocks).
 */
const triggerGoogleSignin = () => {
  if (window.google?.accounts?.id) {
    // Attempt One-Tap / Popup first. We pass a prompt callback so we know if
    // Google decided not to display the UI (cool-down, browser unsupported…).
    window.google.accounts.id.prompt((notification: any) => {
      const notDisplayed = notification.isNotDisplayed?.();
      const skipped = notification.isSkippedMoment?.();
      if (notDisplayed || skipped) {
        // The user won’t see any Google UI → fall back to full OAuth redirect.
        window.location.href = `${API_BASE}/api/auth/google`;
      }
      // If the UI *is* displayed we don’t need to do anything else – the popup
      // handles the flow and calls the credential callback we registered in
      // `initialize()` below.
    });
  } else {
    // Google script did not load for some reason → fallback
    window.location.href = `${API_BASE}/api/auth/google`;
  }
};

// ---------------------------------------------------------------------------

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, loginLoading, loginWithGoogle } = useAuth();
  const [googleReady, setGoogleReady] = useState(false);

  // Initialise Google Identity Services once the script is available.
  useEffect(() => {
    const initialize = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        ux_mode: 'popup', // explicitly request popup so we can fall back
        callback: async (response: any) => {
          try {
            await loginWithGoogle(response.credential);
            navigate('/dashboard');
          } catch (err: any) {
            toast({
              variant: 'destructive',
              title: 'Google sign-in failed',
              description: err?.message || 'Please try again.',
            });
          }
        },
      });

      setGoogleReady(true);
    };

    // If the script has already been injected by index.html we can initialise
    // immediately. Otherwise, wait until it’s loaded.
    if (window.google?.accounts?.id) {
      initialize();
    } else {
      // Attach a listener for when the Google script finishes loading.
      const listener = () => initialize();
      window.addEventListener('load', listener, { once: true });
      return () => window.removeEventListener('load', listener);
    }
  }, [loginWithGoogle, navigate, toast]);

  // -------------------------------------------------------------------------

  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-purple-950 to-blue-950 p-6 text-slate-200">
      <img src={logo} alt="DentAI" className="mb-8 w-40" />

      {/* Login buttons -----------------------------------------------------*/}
      <div className="flex w-full max-w-sm flex-col gap-4">
        {/* Google ---------------------------------------------------------*/}
        <button
          onClick={triggerGoogleSignin}
          disabled={!googleReady || loginLoading}
          className="flex items-center justify-center gap-3 rounded-xl bg-white py-3 font-medium text-slate-900 shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          <img src={GoogleIcon} alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

        {/* Apple (future) --------------------------------------------------*/}
        <button className="flex items-center justify-center gap-3 rounded-xl bg-slate-800 py-3 font-medium shadow-md transition hover:shadow-lg">
          <img src={AppleIcon} alt="Apple" className="h-5 w-5" />
          Continue with Apple
        </button>
      </div>

      {/* Footer -----------------------------------------------------------*/}
      <img src={dentaiBottom} aria-hidden className="pointer-events-none fixed bottom-0 left-1/2 w-[1500px] -translate-x-1/2 select-none" />

      {/* Loader overlay when processing login -----------------------------*/}
      {loginLoading && <Loader />}
    </div>
  );
};

export default Login;