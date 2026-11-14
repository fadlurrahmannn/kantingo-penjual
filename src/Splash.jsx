import { useEffect, useState } from "react";

export default function Splash() {
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 1800);
    const t2 = setTimeout(() => setPhase("gone"), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center"
      style={{
        background: "linear-gradient(180deg, #F0FF55 0%, #F9FFB5 100%)",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 600ms ease",
      }}
    >
      <div className="flex flex-col items-center" style={{ animation: "splashIn 700ms ease both" }}>
        <svg width="120" height="140" viewBox="0 0 100 120">
          <circle cx="50" cy="48" r="44" fill="#1428C8" />
          <path d="M50 118 L28 78 L72 78 Z" fill="#1428C8" />
          <rect x="36" y="20" width="6" height="26" rx="3" fill="#EEFF5A" />
          <rect x="47" y="20" width="6" height="26" rx="3" fill="#EEFF5A" />
          <rect x="58" y="20" width="6" height="26" rx="3" fill="#EEFF5A" />
          <rect x="36" y="38" width="28" height="16" rx="8" fill="#EEFF5A" />
          <rect x="45.5" y="50" width="9" height="46" rx="4.5" fill="#EEFF5A" />
        </svg>
        <p className="mt-4 text-4xl text-[#1428C8]">
          <span className="font-normal">Kantin</span>
          <span className="font-extrabold">GO</span>
        </p>
        <p className="mt-1 text-xs font-semibold text-[#1428C8]/60 tracking-widest">MITRA PENJUAL</p>
      </div>
      <style>{`@keyframes splashIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}