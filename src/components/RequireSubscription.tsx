// src/components/RequireSubscription.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStripeData } from "@/context/StripeContext";
import Loader from "@components/ui/Loader";

interface Props {
  children: React.ReactElement;
}

const RequireSubscription: React.FC<Props> = ({ children }) => {
  const { subscription } = useStripeData();
  const location = useLocation();

  // subscription will be `undefined` while loading
  if (subscription === undefined) {
    return <Loader fullscreen />;
  }

  // active paid subscription?
  if (subscription.subscriptionId) {
    return children;
  }

  // otherwise redirect to subscribe
  return (
    <Navigate
      to="/subscribe"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
};

export default RequireSubscription;
