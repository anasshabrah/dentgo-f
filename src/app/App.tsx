import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import RoutesConfig from "./routes";
import Loader from "../components/ui/Loader";

export default function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <Suspense fallback={<Loader />}>                 
          <RoutesConfig />
        </Suspense>
      </ModalProvider>
    </BrowserRouter>
  );
}
