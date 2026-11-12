import { useState } from "react";
import {
  Store, Pencil, Lock, Clock, MapPin, History, Star, Bell, Zap, Globe,
  CircleHelp, FileText, Info, LogOut, ChevronRight, X, CheckCircle2,
} from "lucide-react";

const BLUE = "bg-[#1428C8]";
const input = "w-full bg-[#eef1ff] rounded-2xl px-4 py-3 text-sm outline-none";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-lg shadow-blue-900/5 ${className}`}>{children}</div>
);

const Section = ({ title, children }) => (
  <div>
    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 px-1">{title}</p>
    <Card className="divide-y divide-gray-100 overflow-hidden">{children}</Card>
  </div>
);

const Row = ({ icon: Icon, title, desc, onClick, right, badge }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#f6f8ff] transition">
    <div className="w-10 h-10 rounded-2xl bg-[#eef1ff] grid place-items-center text-[#1428C8] shrink-0"><Icon size={18} /></div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm flex items-center gap-2">
        {title}
        {badge && <span className="bg-[#EEFF5A] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
      </p>
      <p className="text-xs text-gray-400 truncate">{desc}</p>
    </div>
    {right ?? <ChevronRight size={18} className="text-gray-300" />}
  </button>
);

const Toggle = ({ on, onChange }) => (
  <span onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-12 h-7 rounded-full p-1 transition shrink-0 ${on ? "bg-[#1428C8]" : "bg-gray-300"}`}>
    <span className={`block w-5 h-5 bg-white rounded-full transition ${on ? "translate-x-5" : ""}`} />
  </span>
);

const Chip = ({ children }) => (
  <span className="text-[11px] font-bold bg-[#eef1ff] text-[#1428C8] px-3 py-1 rounded-full shrink-0">{children}</span>
);

const reviews = [
  { n: "Radhitya F.", s: 5, t: "Kopinya enak, gula arennya pas!" },
  { n: "Dina A.", s: 5, t: "Cepat banget, pas diambil masih dingin." },
  { n: "Rafi M.", s: 4, t: "Matcha-nya lembut, antrean agak lama." },
];

const notifs = [
  "Pesanan baru KGO-8921 masuk",
  "Pesanan KGO-7306 menunggu diterima",
  "Rating warung kamu naik jadi 4.8",
];

const infos = {
  bantuan: ["Pusat Bantuan & FAQ", "Butuh bantuan? Hubungi admin KantinGO lewat email support@kantingo.app atau datang ke kantor pengelola kantin."],
  syarat: ["Syarat & Ketentuan", "Mitra wajib menyiapkan pesanan sesuai waktu pengambilan yang dipilih pembeli dan menjaga ketersediaan menu tetap akurat."],
  tentang: ["Tentang KantinGO Penjual", "KantinGO membantu warung kantin kampus menerima pesanan online tanpa antre. Versi 1.0 (prototype)."],
};

export default function Profil({ selesai, setTab }) {
  const [profile, setProfile] = useState({
    name: "Kedai Kopi Kampus 2.0", username: "kedaikopikampus", email: "kedaikopi@kampus.ac.id", phone: "0812-3456-7890", location: "Kantin Pusat, Sayap Barat",
  });
  const [jam, setJam] = useState({ buka: "07:30", tutup: "19:00" });
  const [notif, setNotif] = useState(true);
  const [auto, setAuto] = useState(false);
  const [lang, setLang] = useState("Bahasa Indonesia");
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState({});
  const [toast, setToast] = useState("");

  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 2000); };
  const openModal = (m, d = {}) => { setDraft(d); setModal(m); };
  const close = () => setModal(null);

  const saveProfile = () => { setProfile(draft); close(); say("Profil warung diperbarui"); };
  const saveJam = () => { setJam(draft); close(); say("Jam operasional diperbarui"); };
  const savePass = () => {
    if (!draft.baru || draft.baru.length < 6) return say("Kata sandi baru minimal 6 karakter");
    if (draft.baru !== draft.ulang) return say("Konfirmasi kata sandi tidak sama");
    close(); say("Kata sandi berhasil diubah");
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-start">
      {/* Kolom kiri */}
      <div className="space-y-4 md:space-y-6 md:sticky md:top-24">
        <Card className="p-5 flex items-center gap-4">
          <div className={`${BLUE} w-16 h-16 rounded-2xl grid place-items-center text-white shrink-0`}><Store /></div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold truncate">{profile.name}</p>
            <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            <span className="inline-block mt-1 text-[11px] font-mono bg-[#eef1ff] text-[#1428C8] px-2 py-0.5 rounded-md">@{profile.username}</span>
          </div>
          <button onClick={() => openModal("edit", profile)} className="w-9 h-9 rounded-full bg-[#eef1ff] text-[#1428C8] grid place-items-center shrink-0"><Pencil size={15} /></button>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-[10px] font-bold text-gray-400">RATING</p>
            <p className="text-2xl font-extrabold mt-1">4.8</p>
            <button onClick={() => openModal("ulasan")} className="text-xs font-bold text-[#1428C8]">Lihat ulasan →</button>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-bold text-gray-400">SELESAI</p>
            <p className="text-2xl font-extrabold mt-1">{selesai} Pesanan</p>
            <button onClick={() => setTab("laporan")} className="text-xs font-bold text-[#1428C8]">Lihat laporan →</button>
          </Card>
        </div>
      </div>

      {/* Kolom kanan */}
      <div className="md:col-span-2 space-y-4 md:space-y-6">
        <Section title="AKUN">
          <Row icon={Pencil} title="Edit Profil Warung" desc="Nama warung, username, email & nomor HP" onClick={() => openModal("edit", profile)} />
          <Row icon={Lock} title="Ubah Kata Sandi" desc="Perbarui kata sandi akun untuk keamanan" onClick={() => openModal("pass", { lama: "", baru: "", ulang: "" })} />
          <Row icon={MapPin} title="Lokasi Warung" desc={profile.location} onClick={() => openModal("edit", profile)} />
          <Row icon={Clock} title="Jam Operasional" desc={`Setiap hari, ${jam.buka} - ${jam.tutup}`} onClick={() => openModal("jam", jam)} />
        </Section>

        <Section title="AKTIVITAS">
          <Row icon={History} title="Riwayat Pesanan" desc="Daftar transaksi pesanan yang telah selesai" onClick={() => setTab("laporan")} />
          <Row icon={Star} title="Ulasan Pelanggan" desc="Review dan rating dari pembeli" onClick={() => openModal("ulasan")} />
          <Row icon={Bell} title="Pusat Notifikasi" desc="Riwayat notifikasi & status pesanan" badge="3 baru" onClick={() => openModal("notif")} />
        </Section>

        <Section title="PENGATURAN">
          <Row icon={Bell} title="Notifikasi Pesanan" desc="Beritahu saat ada pesanan baru masuk" onClick={() => setNotif(!notif)} right={<Toggle on={notif} onChange={() => setNotif(!notif)} />} />
          <Row icon={Zap} title="Terima Pesanan Otomatis" desc="Pesanan langsung diproses tanpa konfirmasi" onClick={() => setAuto(!auto)} right={<Toggle on={auto} onChange={() => setAuto(!auto)} />} />
          <Row icon={Globe} title="Bahasa" desc="Pilihan bahasa aplikasi"
            onClick={() => setLang(lang === "Bahasa Indonesia" ? "English" : "Bahasa Indonesia")} right={<Chip>{lang}</Chip>} />
        </Section>

        <Section title="LAINNYA">
          <Row icon={CircleHelp} title="Pusat Bantuan & FAQ" desc="Panduan dan kontak admin" onClick={() => openModal("bantuan")} />
          <Row icon={FileText} title="Syarat & Ketentuan" desc="Aturan penggunaan untuk mitra" onClick={() => openModal("syarat")} />
          <Row icon={Info} title="Tentang KantinGO" desc="Versi 1.0 (prototype)" onClick={() => openModal("tentang")} />
        </Section>

        <button onClick={() => openModal("logout")}
          className="w-full py-3 rounded-2xl bg-red-50 border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2">
          <LogOut size={16} /> Keluar dari Akun
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={close}>
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-lg">
                {{ edit: "Edit Profil Warung", pass: "Ubah Kata Sandi", jam: "Jam Operasional", ulasan: "Ulasan Pelanggan", notif: "Pusat Notifikasi", logout: "Keluar dari Akun" }[modal] || infos[modal]?.[0]}
              </p>
              <button onClick={close} className="w-8 h-8 rounded-full bg-[#eef1ff] grid place-items-center"><X size={16} /></button>
            </div>

            {modal === "edit" && (
              <>
                {[["name", "Nama warung"], ["username", "Username"], ["email", "Email"], ["phone", "Nomor HP"], ["location", "Lokasi warung"]].map(([k, l]) => (
                  <div key={k}>
                    <p className="text-xs font-semibold text-gray-500 mb-1">{l}</p>
                    <input className={input} value={draft[k] || ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                  </div>
                ))}
                <button onClick={saveProfile} className={`${BLUE} text-white w-full py-3 rounded-full font-bold`}>Simpan</button>
              </>
            )}

            {modal === "pass" && (
              <>
                {[["lama", "Kata sandi lama"], ["baru", "Kata sandi baru"], ["ulang", "Ulangi kata sandi baru"]].map(([k, l]) => (
                  <input key={k} type="password" placeholder={l} className={input} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                ))}
                <button onClick={savePass} className={`${BLUE} text-white w-full py-3 rounded-full font-bold`}>Ubah Kata Sandi</button>
              </>
            )}

            {modal === "jam" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs font-semibold text-gray-500 mb-1">Buka</p>
                    <input type="time" className={input} value={draft.buka} onChange={(e) => setDraft({ ...draft, buka: e.target.value })} /></div>
                  <div><p className="text-xs font-semibold text-gray-500 mb-1">Tutup</p>
                    <input type="time" className={input} value={draft.tutup} onChange={(e) => setDraft({ ...draft, tutup: e.target.value })} /></div>
                </div>
                <button onClick={saveJam} className={`${BLUE} text-white w-full py-3 rounded-full font-bold`}>Simpan</button>
              </>
            )}

            {modal === "ulasan" && reviews.map((r) => (
              <div key={r.n} className="bg-[#eef1ff] rounded-2xl p-4">
                <p className="font-bold text-sm">{r.n} <span className="text-yellow-500">{"★".repeat(r.s)}</span></p>
                <p className="text-sm text-gray-600">{r.t}</p>
              </div>
            ))}

            {modal === "notif" && notifs.map((n) => (
              <div key={n} className="flex items-center gap-3 bg-[#eef1ff] rounded-2xl p-4 text-sm font-semibold"><Bell size={16} className="text-[#1428C8]" />{n}</div>
            ))}

            {infos[modal] && <p className="text-sm text-gray-600 leading-relaxed">{infos[modal][1]}</p>}

            {modal === "logout" && (
              <>
                <p className="text-sm text-gray-600">Yakin mau keluar dari akun mitra?</p>
                <button onClick={() => { close(); say("Berhasil keluar (demo)"); }} className="w-full py-3 rounded-full bg-red-500 text-white font-bold">Ya, Keluar</button>
                <button onClick={close} className="w-full py-3 rounded-full bg-gray-100 font-bold">Batal</button>
              </>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#1428C8] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#EEFF5A]" /> {toast}
        </div>
      )}
    </div>
  );
}