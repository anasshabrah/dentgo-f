// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash.jsx";
import LetsYouIn from "./pages/LetsYouIn.jsx";
import NotificationAllow from "./pages/NotificationAllow.jsx";

import DentgoGptHome from "./pages/DentgoGptHome.jsx";
import DentgoChat from "./pages/DentgoChat.jsx";

import History from "./pages/History.jsx";
import BankCards from "./pages/BankCards.jsx";
import AddNewCard from "./pages/AddNewCard.jsx";
import PaymentMethod from "./pages/PaymentMethod.jsx";
import CancelSubscription from "./pages/CancelSubscription.jsx";
import PlusSubscription from "./pages/PlusSubscription.jsx";
import NotificationSetting from "./pages/NotificationSetting.jsx";
import Currency from "./pages/Currency.jsx";
import TermsAndPrivacy from "./pages/TermsAndPrivacy.jsx";
import Alert from "./pages/Alert.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import ConfirmPaymentPin from "./pages/ConfirmPaymentPin.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import SubscriptionPayment from "./pages/SubscriptionPayment.jsx";
import SelectPaymentMethod from "./pages/SelectPaymentMethod.jsx";
import Notification from "./pages/Notification.jsx";
import Delete from "./pages/Delete.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public flows */}
        <Route path="/" element={<Splash />} />
        <Route path="/LetsYouIn" element={<LetsYouIn />} />
        <Route path="/NotificationAllow" element={<NotificationAllow />} />

        {/* Protected flows */}
        <Route element={<PrivateRoute />}>
          <Route path="/DentgoGptHome" element={<DentgoGptHome />} />
          <Route path="/DentgoChat" element={<DentgoChat />} />
        </Route>

        {/* Other public pages */}
        <Route path="/History" element={<History />} />
        <Route path="/BankCards" element={<BankCards />} />
        <Route path="/AddNewCard" element={<AddNewCard />} />
        <Route path="/PaymentMethod" element={<PaymentMethod />} />
        <Route path="/CancelSubscription" element={<CancelSubscription />} />
        <Route path="/PlusSubscription" element={<PlusSubscription />} />
        <Route path="/NotificationSetting" element={<NotificationSetting />} />
        <Route path="/Currency" element={<Currency />} />
        <Route path="/TermsAndPrivacy" element={<TermsAndPrivacy />} />
        <Route path="/Alert" element={<Alert />} />
        <Route path="/Confirmation" element={<Confirmation />} />
        <Route path="/ConfirmPaymentPin" element={<ConfirmPaymentPin />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/SubscriptionPayment" element={<SubscriptionPayment />} />
        <Route path="/SelectPaymentMethod" element={<SelectPaymentMethod />} />
        <Route path="/Notification" element={<Notification />} />
        <Route path="/Delete" element={<Delete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
