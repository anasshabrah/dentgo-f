// src/app/App.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import RoutesConfig from "./routes";
import Loader from "../components/ui/Loader";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ModalProvider>
        {/* Suspense fallback is now full-screen */}
        <React.Suspense fallback={<Loader fullscreen />}>
          <RoutesConfig />
        </React.Suspense>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;
