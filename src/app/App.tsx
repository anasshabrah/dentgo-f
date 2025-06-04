import React, { useState } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import RoutesConfig from "./routes";
import Loader from "../components/ui/Loader";
import Splash from "../pages/Splash";

const App: React.FC = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <BrowserRouter>
      <ModalProvider>
        {isSplashVisible ? (
          <SplashWrapper onComplete={() => setIsSplashVisible(false)} />
        ) : (
          <React.Suspense fallback={<Loader />}>
            <RoutesConfig />
          </React.Suspense>
        )}
      </ModalProvider>
    </BrowserRouter>
  );
};

const SplashWrapper: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const navigate = useNavigate();

  const handleSplashComplete = () => {
    console.log("[Splash] App.tsx → Splash completed → Navigating to login");
    onComplete();
    navigate("/login");
  };

  return <Splash onComplete={handleSplashComplete} />;
};

export default App;
