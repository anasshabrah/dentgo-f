import { useEffect } from "react";

export default function useGoogleIdentity() {
  useEffect(() => {
    const id = "google-identity-script";
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);
}
