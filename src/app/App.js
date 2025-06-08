import { jsx as _jsx } from "react/jsx-runtime";
// src/app/App.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "@context/ModalContext";
import RoutesConfig from "./routes";
import Loader from "@components/ui/Loader";
const App = () => {
    return (_jsx(BrowserRouter, { children: _jsx(ModalProvider, { children: _jsx(React.Suspense, { fallback: _jsx(Loader, { fullscreen: true }), children: _jsx(RoutesConfig, {}) }) }) }));
};
export default App;
