// src/pages/LetsYouIn.jsx
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

const API_BASE = process.env.REACT_APP_SERVER_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function LetsYouIn() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
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
      } catch (err) {
        console.error(err);
        alert('Authentication failed');
      }
    },
    [login]
  );

  // Initialize Google Identity
  useGoogleIdentity();
  useEffect(() => {
    loadGoogle(() => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
        ux_mode: 'popup', // Ensures popup flow on button click
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

            <div className="icons_main icons_main2">
              {/* Google */}
              <button
                type="button"
                className="oauth-btn"
                onClick={() => {
                  if (window.google?.accounts?.id) {
                    window.google.accounts.id.prompt();
                  } else {
                    alert('Google login is not initialized yet. Please try again.');
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
