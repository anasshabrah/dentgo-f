import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { DarkModeProvider } from "@components/DarkModeContext";
import { AuthProvider } from "@context/AuthContext";

declare global {
  interface Window {
    // add any global types you need here later
  }
}

console.log("[Startup] index.tsx → about to create root and render <App />");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DarkModeProvider>
  </React.StrictMode>
);

console.log("[Startup] index.tsx → <App /> render call done");

reportWebVitals(() => {});
