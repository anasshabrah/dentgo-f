import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Loader from '../components/Loader';
import buttonBack from '../assets/images/Button-Back.png';
import logo from '../assets/images/logo.png';
import AppleIcon from '../assets/images/Icon-apple.png';
import GoogleIcon from '../assets/images/Icon-google.png';

import useGoogleIdentity from '../hooks/useGoogleIdentity';
import { loadGoogle } from '../lib/google';

import { useAuth } from '../context/AuthContext';
import { loginWithGoogle, loginWithApple } from '../api/auth';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function LetsYouIn() {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, setError } = useAuth();
  const [loading, setLoading] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/DentgoGptHome', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Unified Google callback
  const handleCredential = useCallback(
    async ({ credential }) => {
      try {
        const user = await loginWithGoogle(credential);
        login(user);
        // Navigate immediately after successful login to reduce perceived delay
        navigate('/DentgoGptHome', { replace: true });
      } catch (err) {
        console.error('Google login error:', err);
        setError(
          'Authentication failed. Please try again or use a different browser mode.'
        );
      }
    },
    [login, navigate, setError]
  );

  // Initialize Google Identity
  useGoogleIdentity();
  useEffect(() => {
    loadGoogle(() => {
      if (!window.google?.accounts?.id) {
        console.error('Google Identity not loaded.');
        setError(
          'Google login is not available at the moment. Please try again later.'
        );
        return;
      }
      if (!CLIENT_ID) {
        console.error('Missing REACT_APP_GOOGLE_CLIENT_ID!');
        alert('Google Login misconfigured: missing client ID.');
        return;
      }
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
        ux_mode: 'popup',
      });
    });
  }, [handleCredential]);

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        {/* Back Button */}
        <header className="absolute top-4 left-4">
          <Link onClick={() => navigate(-1)} className="flex items-center">
            <img className="w-8 h-8" src={buttonBack} alt="Go Back" />
          </Link>
        </header>

        {/* Logo and Title */}
        <div className="text-center">
          <img className="mx-auto w-40 h-40" src={logo} alt="Dentgo logo" />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">DentGo AI</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md my-4 cursor-pointer"
            onClick={() => setError(null)}
          >
            {error}
          </div>
        )}

        {/* Welcome Text */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Welcome</h2>

        {/* OAuth Buttons */}
        <div className="mt-8 space-y-4">
          {/* Google Login Button */}
          <button
            type="button"
            className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-3 w-64 hover:bg-gray-50"
            onClick={() => {
              if (window.google?.accounts?.id) {
                window.google.accounts.id.prompt();
              } else {
                alert('Google login is not ready yet.');
              }
            }}
          >
            <img className="w-6 h-6 mr-3" src={GoogleIcon} alt="Google logo" />
            <span className="text-lg text-gray-800">Continue with Google</span>
          </button>

          {/* Apple Login Button */}
          <button
            type="button"
            className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-3 w-64 hover:bg-gray-50"
            onClick={() => loginWithApple()}
          >
            <img className="w-6 h-6 mr-3" src={AppleIcon} alt="Apple logo" />
            <span className="text-lg text-gray-800">Continue with Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}