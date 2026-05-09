import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("beevr-splash-shown")) {
      setVisible(false);
      return;
    }
    const fadeTimer = setTimeout(() => setFading(true), 1100);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("beevr-splash-shown", "1");
    }, 1700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
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
