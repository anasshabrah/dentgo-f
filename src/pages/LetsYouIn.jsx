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
    <div className="site_content">
      <div className="let-you-page-main">
        <div className="let-you-screen-main">
          <header className="back-btn back-btn2 top-navbar">
            <Link onClick={() => navigate(-1)}>
              <img className="profile-pic" src={buttonBack} alt="Go Back" />
            </Link>
          </header>
          <div className="Dentgo_img_main">
            <img className="Dentgo_img" src={logo} alt="Dentgo logo" />
            <h1 className="Dentgo_title">DentGo AI</h1>
          </div>
        </div>

        <div className="footer_box">
          <div className="lets_you_in_box lets_you_in_box2">
            <h2 className="lets_you_in_text">Welcome</h2>

            {/* Show error message if present */}
            {error && (
              <div
                className="alert alert-warning"
                style={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  cursor: 'pointer',
                }}
                onClick={() => setError(null)}
              >
                {error}
              </div>
            )}

            <div className="icons_main icons_main2">
              {/* Google */}
              <button
                type="button"
                className="oauth-btn"
                onClick={() => {
                  if (window.google?.accounts?.id) {
                    window.google.accounts.id.prompt();
                  } else {
                    alert('Google login is not ready yet.');
                  }
                }}
              >
                <img src={GoogleIcon} alt="Google logo" />
                <span>Continue with Google</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                className="oauth-btn"
                onClick={() => loginWithApple()}
              >
                <img src={AppleIcon} alt="Apple logo" />
                <span>Continue with Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
