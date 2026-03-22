import { useEffect } from "react";

export function usePWAPrompt() {
  useEffect(() => {
    let deferredPrompt;
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      // Optionally, show your own install UI here
      window.dispatchEvent(new CustomEvent("pwa-install-available"));
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
}
