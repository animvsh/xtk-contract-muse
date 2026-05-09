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
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[oklch(0.04_0_0)] transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.72_0.21_45)] opacity-40 blur-[120px]" />
      </div>
      <div className="relative flex flex-col items-center gap-5 splash-pop">
        <BrandLogo className="h-24 w-24 object-contain drop-shadow-[0_0_40px_oklch(0.72_0.21_45/0.6)]" />
        <span className="text-2xl font-bold tracking-tight text-white">Beevr</span>
      </div>
    </div>
  );
}
