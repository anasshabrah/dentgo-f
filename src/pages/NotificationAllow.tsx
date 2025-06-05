import React, { useEffect, useState } from "react";
import notificationImg from "../assets/images/notification-img.png";
import { Link } from "react-router-dom";
import Loader from "../components/ui/Loader";

const NotificationAllow: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-4">
      <div className="mx-auto max-w-[480px] px-4">
        <div className="bg-white mt-5 rounded-t-[24px] px-4 flex flex-col items-center">
          <img src={notificationImg} alt="notification" className="max-w-full mb-4" />
          <p className="text-gray-500 text-[18px] leading-[24px] text-center mb-6 px-2">
            Stay updated on offers, car listings, and status alerts. You can manage notifications from
            settings later.
          </p>
          <div className="w-full max-w-[343px] mb-4">
            <Link
              to="/login"
              className="block bg-white text-[#0078D7] font-medium text-[18px] leading-[24px] text-center py-4 rounded-[12px] hover:bg-[#0064ba] transition"
            >
              Continue with Google or Apple
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationAllow;
