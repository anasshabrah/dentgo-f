import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import buttonBack from "../assets/images/Button-Back.png";
import chatMenuImg from "../assets/images/chat-menu-img.png";
import { fetchChatSessions } from "../api/chats";

export default function History() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChatSessions()
      .then((data) => setSessions(data))
      .catch((err) => setError(err.message || "Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="site_content">
        <div className="verification-main">
          <div className="container verify-screen-main p-0">
            <button
              className="btn btn-link p-0 mb-3"
              onClick={() => navigate(-1)}
            >
              <img src={buttonBack} alt="Back" className="profile-pic" />
            </button>
            <h2 className="text-danger">Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  // Helpers to render each list
  const renderList = (items, isEnded) =>
    items.map((s) => (
      <Link
        key={s.id}
        to={`/DentgoChat?sessionId=${s.id}`}
        className="notification-security-box mb-3 d-flex align-items-center"
      >
        <img
          src={chatMenuImg}
          alt="Chat icon"
          className="history-menu-img me-3"
        />
        <div>
          <h3 className="security-update-text">
            {s.title ?? `Chat #${s.id}`}
          </h3>
          <p className="today-text">
            {isEnded
              ? `Ended ${new Date(s.endedAt).toLocaleString()}`
              : `Started ${new Date(s.startedAt).toLocaleString()}`}
          </p>
        </div>
      </Link>
    ));

  const active = sessions.filter((s) => !s.endedAt);
  const ended = sessions.filter((s) => !!s.endedAt);

  return (
    <div className="site_content">
      <div className="verification-main">
        <div className="container verify-screen-main p-0">
          {/* Back button + header */}
          <div className="back-btn back-btn2 d-flex align-items-center mb-4">
            <button
              className="btn btn-link p-0 me-2"
              onClick={() => navigate(-1)}
            >
              <img src={buttonBack} alt="Back" className="profile-pic" />
            </button>
            <h1>History</h1>
          </div>

          <div className="verify-section-main align-items-stretch">
            {/* Active Chats */}
            <h2 className="active-chats">Active Chats</h2>
            {active.length > 0 ? (
              renderList(active, false)
            ) : (
              <p className="today-text">No active chats.</p>
            )}

            {/* Ended Chats */}
            <h2 className="active-chats ended-chats mt-5">Ended Chats</h2>
            {ended.length > 0 ? (
              renderList(ended, true)
            ) : (
              <p className="today-text">No ended chats.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}