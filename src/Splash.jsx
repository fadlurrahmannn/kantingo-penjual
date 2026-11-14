import { useEffect, useState } from "react";

const LOGO_WIDTH = 250; // ubah angka ini sesuai hasil cek di DevTools

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
        background: "linear-gradient(180deg, #EEFF4F 0%, #F7FFB0 100%)",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 600ms ease",
      }}
    >
      <img
        src="/logo.png"
        alt="KantinGO"
        style={{ width: LOGO_WIDTH, maxWidth: "70vw", animation: "splashIn 700ms ease both" }}
      />
      <style>{`@keyframes splashIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}