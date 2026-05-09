import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismiss = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 700);
    };

    const maxTimer = setTimeout(dismiss, 3000);
    const minTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        dismiss();
      } else {
        window.addEventListener("load", dismiss, { once: true });
      }
    }, 700);

    return () => {
      clearTimeout(maxTimer);
      clearTimeout(minTimer);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[oklch(0.98_0.015_85)] ${
        fading ? "splash-out" : ""
      }`}
      aria-hidden="true"
    >
      <div className="relative">
        {/* expanding rings */}
        <span className="splash-ring absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[oklch(0.68_0.22_40)]/40" />
        <span className="splash-ring splash-ring-delay absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[oklch(0.68_0.22_40)]/30" />
        <BrandLogo className="splash-logo relative h-28 w-28 object-contain" />
      </div>
    </div>
  );
}
