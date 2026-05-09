import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismiss = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 400);
    };

    const maxTimer = setTimeout(dismiss, 1500);
    const minTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        dismiss();
      } else {
        window.addEventListener("load", dismiss, { once: true });
      }
    }, 350);

    return () => {
      clearTimeout(maxTimer);
      clearTimeout(minTimer);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[oklch(0.98_0.015_85)] transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <BrandLogo className="splash-logo h-28 w-28 object-contain" />
    </div>
  );
}
