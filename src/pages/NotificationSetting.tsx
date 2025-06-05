import React, { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";

const NotificationSetting: React.FC = () => {
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
        <div className="bg-white mt-5 rounded-t-[24px] px-4 pt-6 flex flex-col space-y-4">
          <h2 className="text-gray-800 text-[18px] font-semibold leading-[24px] text-center">
            We will notify you when...
          </h2>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">Your invoices are paid</p>
            <input type="checkbox" name="invoice" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">Someone requests money from you</p>
            <input type="checkbox" name="money-request" defaultChecked />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You send money to someone</p>
            <input type="checkbox" name="money-sent" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You receive money from someone</p>
            <input type="checkbox" name="money-received" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You purchase something</p>
            <input type="checkbox" name="purchase" defaultChecked />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You receive a QR code payment</p>
            <input type="checkbox" name="qr-payment" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You receive a direct payment</p>
            <input type="checkbox" name="direct-payment" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You receive subscriptions info</p>
            <input type="checkbox" name="subscription-info" />
          </div>

          <div className="flex items-center justify-between border-b-0 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You receive announcements & offers</p>
            <input type="checkbox" name="announcements" defaultChecked />
          </div>

          <div className="flex items-center justify-between border-b-0 py-4">
            <p className="text-gray-800 text-[16px] font-medium">You receive app updates info</p>
            <input type="checkbox" name="app-updates" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;
