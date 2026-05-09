import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismiss = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    };

    // Safety: never let it stay forever
    const maxTimer = setTimeout(dismiss, 3000);
    // Minimum visibility so it doesn't flash
    const minTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        dismiss();
      } else {
        window.addEventListener("load", dismiss, { once: true });
      }
    }, 400);

    return () => {
      clearTimeout(maxTimer);
      clearTimeout(minTimer);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[oklch(0.98_0.015_85)] transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <BrandLogo className="h-28 w-28 object-contain splash-logo" />
    </div>
  );
}
