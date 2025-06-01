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
      <div className="bg-gray-100 min-h-screen pb-4 flex flex-col">
        <div className="bg-blue-800 pt-4 pb-8">
          <div className="mx-auto max-w-lg px-4">
            <button className="p-0 mb-3" onClick={() => navigate(-1)}>
              <img src={buttonBack} alt="Back" className="w-8 h-auto" />
            </button>
            <h2 className="text-red text-base font-medium">Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  const renderList = (items, isEnded) =>
    items.map((s) => (
      <Link
        key={s.id}
        to={`/DentgoChat?sessionId=${s.id}`}
        className="flex items-center mb-3"
      >
        <img
          src={chatMenuImg}
          alt="Chat icon"
          className="w-6 h-6 mr-3"
        />
        <div>
          <h3 className="text-gray-800 font-sans text-base font-bold leading-6 pb-1">
            {s.title ?? `Chat #${s.id}`}
          </h3>
          <p className="text-gray-500 text-sm leading-5">
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
    <div className="bg-gray-100 min-h-screen pb-4 flex flex-col">
      <div className="bg-blue-800 pt-4 pb-8">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center mb-4">
            <button className="p-0 mr-2" onClick={() => navigate(-1)}>
              <img src={buttonBack} alt="Back" className="w-8 h-auto" />
            </button>
            <h1 className="text-white text-lg font-medium leading-6">
              History
            </h1>
          </div>
        </div>
      </div>
      <div className="bg-white mt-5 rounded-t-3xl px-4 flex flex-col h-[calc(100vh-90px)] overflow-y-auto">
        <div className="pt-4">
          <h2 className="text-gray-800 text-xl font-semibold leading-7">
            Active Chats
          </h2>
          {active.length > 0 ? (
            renderList(active, false)
          ) : (
            <p className="text-gray-500 text-sm leading-5">
              No active chats.
            </p>
          )}
          <h2 className="text-gray-800 text-xl font-semibold leading-7 pt-6">
            Ended Chats
          </h2>
          {ended.length > 0 ? (
            renderList(ended, true)
          ) : (
            <p className="text-gray-500 text-sm leading-5">
              No ended chats.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
