// src/hooks/useGoogleIdentity.ts
import { useEffect } from "react";

type Callback = () => void;

export default function useGoogleIdentity(callback?: Callback): void {
  useEffect(() => {
    const id = "google-identity-script";
    if (document.getElementById(id)) {
      callback?.();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      callback?.();
    };
    document.body.appendChild(script);
  }, [callback]);
}