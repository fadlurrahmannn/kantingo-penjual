import { useState } from "react";
import { Home, UtensilsCrossed, ClipboardList, BarChart3, User, Plus, Bell, Trash2, Minus } from "lucide-react";
import Profil from "./Profil";
import Laporan from "./Laporan";
import Struk from "./Struk";
import Info from "./Info";
import Splash from "./Splash";
import { BLUE, YELLOW, rp, total, itemsText, Card, Page } from "./shared";

const mk = (id, day, items) => ({
  id, day, status: "selesai", pickup: "Secepatnya (±10 mnt)",
  items: items.map(([name, qty, price]) => ({ name, qty, price })),
});

const initOrders = [
  { id: "KGO-8921", day: 0, status: "baru", pickup: "Secepatnya (±10 mnt)", items: [
    { name: "Ayam Geprek Sambal Matah", qty: 2, price: 19000, opt: "+ Level 2 (Sedang), Nasi Biasa", note: "Sambal matah dipisah ya bu" },
    { name: "Es Teh Manis Jumbo", qty: 1, price: 4000 },
  ] },
  { id: "KGO-7306", day: 0, status: "baru", pickup: "+15 menit (01:37)", items: [{ name: "Kopi Susu Gula Aren Barista", qty: 3, price: 12000 }] },
  { id: "KGO-6120", day: 0, status: "selesai", pickup: "Secepatnya (±10 mnt)", items: [{ name: "Nasi Goreng Spesial", qty: 1, price: 15000 }] },
  { id: "KGO-5544", day: 0, status: "selesai", pickup: "+30 menit", items: [{ name: "Matcha Latte Creamy Ice", qty: 2, price: 14000 }] },
  mk("KGO-4102", 1, [["Kopi Susu Gula Aren Barista", 4, 12000], ["Roti Bakar Coklat Keju", 2, 10000]]),
  mk("KGO-4033", 1, [["Matcha Latte Creamy Ice", 3, 14000]]),
  mk("KGO-3871", 2, [["Kopi Susu Gula Aren Barista", 5, 12000]]),
  mk("KGO-3790", 2, [["Roti Bakar Coklat Keju", 3, 10000], ["Matcha Latte Creamy Ice", 1, 14000]]),
  mk("KGO-3512", 3, [["Kopi Susu Gula Aren Barista", 2, 12000], ["Matcha Latte Creamy Ice", 2, 14000]]),
  mk("KGO-3340", 4, [["Kopi Susu Gula Aren Barista", 6, 12000]]),
  mk("KGO-3188", 5, [["Roti Bakar Coklat Keju", 4, 10000], ["Kopi Susu Gula Aren Barista", 1, 12000]]),
  mk("KGO-2975", 6, [["Matcha Latte Creamy Ice", 4, 14000], ["Kopi Susu Gula Aren Barista", 2, 12000]]),
];

const initMenu = [
  { id: 1, name: "Kopi Susu Gula Aren Barista", price: 12000, stok: 20 },
  { id: 2, name: "Matcha Latte Creamy Ice", price: 14000, stok: 15 },
  { id: 3, name: "Americano Dingin", price: 10000, stok: 18 },
  { id: 4, name: "Roti Bakar Coklat Keju", price: 10000, stok: 0 },
  { id: 5, name: "Kentang Goreng", price: 9000, stok: 4 },
];

const histTotal = initOrders.filter((o) => o.day > 0).reduce((a, o) => a + total(o), 0);
const initWd = [{ id: "WD-0001", bank: "BCA", no: "7890123456", nama: "Pemilik Warung", amount: histTotal, time: "Kemarin, 16:40" }];

const NEXT = {
  baru: ["Terima Pesanan", "diproses"],
  diproses: ["Tandai Siap Diambil", "siap"],
  siap: ["Pesanan Diambil", "selesai"],
};
const BADGE = {
  baru: "bg-blue-50 text-blue-700 border-blue-200",
  diproses: "bg-orange-50 text-orange-700 border-orange-200",
  siap: "bg-green-50 text-green-700 border-green-200",
  selesai: "bg-gray-100 text-gray-500 border-gray-200",
};
const stokStatus = (s) =>
  s === 0 ? { label: "Habis", cls: "bg-red-100 text-red-600" }
  : s <= 5 ? { label: "Menipis", cls: "bg-orange-100 text-orange-600" }
  : { label: "Tersedia", cls: "bg-green-100 text-green-700" };

const inputCls = "w-full bg-[#eef1ff] rounded-2xl px-4 py-3 text-sm outline-none";

export default function App() {
  const [tab, setTab] = useState("beranda");
  const [infoKey, setInfoKey] = useState("bantuan");
  const cur = tab === "info" ? "profil" : tab;
  const [open, setOpen] = useState(true);
  const [orders, setOrders] = useState(initOrders);
  const [menu, setMenu] = useState(initMenu);
  const [filter, setFilter] = useState("baru");
  const [form, setForm] = useState({ name: "", price: "", stok: "" });
  const [detailId, setDetailId] = useState(null);
  const [wd, setWd] = useState(initWd);
  const [rek, setRek] = useState({ bank: "BCA", no: "", nama: "" });
  const [profile, setProfile] = useState({
    name: "Kedai Kopi Kampus 2.0", username: "kedaikopikampus", email: "kedaikopi@kampus.ac.id",
    phone: "0812-3456-7890", location: "Kantin Pusat, Sayap Barat",
  });
  const [jam, setJam] = useState({ buka: "07:30", tutup: "19:00" });

  const count = (s) => orders.filter((o) => o.status === s).length;
  const sum = (l) => l.reduce((a, o) => a + total(o), 0);
  const selesai = orders.filter((o) => o.status === "selesai");
  const omzetHariIni = sum(selesai.filter((o) => o.day === 0));
  const saldo = sum(selesai) - wd.reduce((a, w) => a + w.amount, 0);
  const low = menu.filter((m) => m.stok <= 5);

  const adjustStok = (o, sign) =>
    setMenu((ms) => ms.map((x) => {
      const it = o.items.find((i) => i.name === x.name);
      return it ? { ...x, stok: Math.max(0, x.stok + sign * it.qty) } : x;
    }));

  const setStatus = (id, status) => {
    const o = orders.find((x) => x.id === id);
    if (!o || o.status === status) return;
    if (o.status === "baru") adjustStok(o, -1);
    if (status === "baru") adjustStok(o, +1);
    setOrders((os) => os.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const addMenu = () => {
    if (!form.name || !form.price) return;
    setMenu([...menu, { id: Date.now(), name: form.name, price: +form.price, stok: +form.stok || 0 }]);
    setForm({ name: "", price: "", stok: "" });
  };
  const ubahStok = (id, d) => setMenu(menu.map((x) => (x.id === id ? { ...x, stok: Math.max(0, x.stok + d) } : x)));

  const withdraw = (w) => {
    setWd([{ id: "WD-" + String(wd.length + 1).padStart(4, "0"), ...w, time: "Baru saja" }, ...wd]);
    setRek({ bank: w.bank, no: w.no, nama: w.nama });
  };

  const nav = [
    { k: "beranda", l: "Beranda", i: Home },
    { k: "menu", l: "Menu", i: UtensilsCrossed },
    { k: "pesanan", l: "Pesanan", i: ClipboardList, center: true },
    { k: "laporan", l: "Laporan", i: BarChart3 },
    { k: "profil", l: "Profil", i: User },
  ];

  return (
    <div className="min-h-screen pb-32 md:pb-0 overflow-x-hidden">
      <Splash />
      {/* Navbar atas (desktop) */}
      <header className={`${BLUE} hidden md:block sticky top-0 z-20 shadow-lg shadow-blue-900/30`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <p className="text-white text-3xl font-extrabold">
            Kantin<span className="text-[#EEFF5A]">GO</span>
            <span className="ml-2 text-xs font-semibold bg-white/15 px-2 py-1 rounded-full align-middle">Penjual</span>
          </p>
          <nav className="flex items-center gap-2">
            {nav.map(({ k, l, i: Icon, center }) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[15px] font-semibold transition ${
                  center ? `${YELLOW} text-[#1428C8]` : cur === k ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
                } ${center && cur === k ? "ring-2 ring-white" : ""}`}>
                <Icon size={18} /> {l}
                {center && count("baru") > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full grid place-items-center">{count("baru")}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {tab === "beranda" && (
        <Page label={`Dashboard Penjual · ${profile.location}`} title={profile.name}
          right={<button className="w-10 h-10 rounded-full bg-white/20 grid place-items-center"><Bell size={18} /></button>}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="flex items-center justify-between">
              <div>
                <p className="font-bold">Status Warung</p>
                <p className={`text-sm font-semibold ${open ? "text-green-600" : "text-red-500"}`}>{open ? "Buka · menerima pesanan" : "Tutup"}</p>
                <p className="text-xs text-gray-400">{jam.buka} - {jam.tutup}</p>
              </div>
              <button onClick={() => setOpen(!open)} className={`w-14 h-8 rounded-full p-1 transition ${open ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`w-6 h-6 bg-white rounded-full transition ${open ? "translate-x-6" : ""}`} />
              </button>
            </Card>
            <Card><p className="text-xs text-gray-400 font-semibold">PESANAN BARU</p><p className="text-3xl font-extrabold mt-1">{count("baru")}</p></Card>
            <Card><p className="text-xs text-gray-400 font-semibold">DIPROSES</p><p className="text-3xl font-extrabold mt-1">{count("diproses")}</p></Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <p className="text-xs text-gray-400 font-semibold">OMZET HARI INI</p>
              <p className="text-3xl font-extrabold text-[#1428C8] mt-1">{rp(omzetHariIni)}</p>
              <p className="text-xs text-gray-400 mt-1">{selesai.filter((o) => o.day === 0).length} pesanan selesai</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-400 font-semibold">SALDO DAPAT DITARIK</p>
              <p className="text-3xl font-extrabold text-[#1428C8] mt-1">{rp(saldo)}</p>
              <button onClick={() => setTab("laporan")} className="text-xs font-bold text-[#1428C8] mt-1">Tarik saldo →</button>
            </Card>
            <button onClick={() => setTab("pesanan")} className={`${BLUE} text-white w-full py-4 rounded-3xl font-bold shadow-lg`}>Lihat Pesanan Masuk →</button>
          </div>
          {low.length > 0 && (
            <Card className="border border-orange-200">
              <p className="font-bold text-sm">Stok menipis / habis</p>
              <p className="text-xs text-gray-500 mt-1">{low.map((m) => `${m.name} (${m.stok})`).join(", ")}</p>
              <button onClick={() => setTab("menu")} className="text-xs font-bold text-[#1428C8] mt-2">Atur stok →</button>
            </Card>
          )}
        </Page>
      )}

      {tab === "pesanan" && (
        <Page label="Aktivitas Pesanan" title="Pesanan Masuk">
          <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(20,40,200,0.10)] p-1.5 flex gap-1 md:max-w-xl">
            {["baru", "diproses", "siap", "selesai"].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`flex-1 py-2 rounded-xl text-xs md:text-sm font-bold capitalize ${filter === s ? BLUE + " text-white" : "text-gray-500"}`}>
                {s} {count(s) > 0 && `(${count(s)})`}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">Ketuk kartu pesanan untuk lihat struk dan ubah status.</p>
          {orders.filter((o) => o.status === filter).length === 0 && (
            <Card className="text-center text-gray-400 text-sm">Belum ada pesanan di sini.</Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {orders.filter((o) => o.status === filter).map((o) => {
              const note = o.items.find((i) => i.note)?.note;
              const next = NEXT[o.status];
              return (
                <Card key={o.id} onClick={() => setDetailId(o.id)} className="flex flex-col h-full cursor-pointer hover:-translate-y-0.5 transition">
                  <div className="flex justify-between items-start">
                    <div><p className="text-[10px] text-gray-400 font-semibold">KODE PESANAN</p><p className="font-extrabold">{o.id}</p></div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${BADGE[o.status]}`}>{o.status}</span>
                  </div>
                  <p className="font-semibold text-sm mt-3">{itemsText(o)}</p>
                  {note && <p className="text-xs italic text-gray-500 mt-2">Catatan: "{note}"</p>}
                  <p className="text-xs text-gray-500 mt-2">Pengambilan: <b className="text-green-600">{o.pickup}</b></p>
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <p className="font-extrabold text-[#1428C8]">{rp(total(o))}</p>
                      {next && (
                        <button onClick={(e) => { e.stopPropagation(); setStatus(o.id, next[1]); }}
                          className={`${BLUE} text-white text-xs font-bold px-4 py-2 rounded-full`}>{next[0]}</button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Page>
      )}

      {tab === "menu" && (
        <Page label="Kelola Dagangan" title="Menu Saya">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
            <Card className="space-y-3 md:sticky md:top-28">
              <p className="font-bold">Tambah Menu Baru</p>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama menu" className={inputCls} />
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Harga (contoh: 12000)" type="number" className={inputCls} />
              <input value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} placeholder="Stok awal (contoh: 20)" type="number" className={inputCls} />
              <button onClick={addMenu} className={`${BLUE} text-white w-full py-3 rounded-full font-bold flex items-center justify-center gap-2`}><Plus size={16} /> Tambah</button>
            </Card>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {menu.map((m) => {
                const st = stokStatus(m.stok);
                return (
                  <Card key={m.id} className="flex flex-col gap-3 h-full">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sm">{m.name}</p>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
                    </div>
                    <p className="text-[#1428C8] font-extrabold">{rp(m.price)}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-semibold">Stok</span>
                        <button onClick={() => ubahStok(m.id, -1)} className="w-8 h-8 rounded-full bg-[#eef1ff] text-[#1428C8] grid place-items-center"><Minus size={14} /></button>
                        <span className="w-8 text-center font-extrabold">{m.stok}</span>
                        <button onClick={() => ubahStok(m.id, 1)} className={`w-8 h-8 rounded-full ${BLUE} text-white grid place-items-center`}><Plus size={14} /></button>
                      </div>
                      <button onClick={() => setMenu(menu.filter((x) => x.id !== m.id))} className="text-red-400 p-2"><Trash2 size={16} /></button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Page>
      )}

      {tab === "laporan" && (
        <Page label="Ringkasan" title="Laporan Penjualan">
          <Laporan orders={orders} saldo={saldo} wd={wd} rek={rek} onWithdraw={withdraw} onOpen={setDetailId} />
        </Page>
      )}

      {tab === "profil" && (
        <Page label="Akun Mitra" title="Profil Warung">
          <Profil selesai={selesai.length} setTab={setTab} profile={profile} setProfile={setProfile} jam={jam} setJam={setJam}
          openInfo={(k) => { setInfoKey(k); setTab("info"); }} />
        </Page>
      )}

{tab === "info" && <Info k={infoKey} onBack={() => setTab("profil")} />}

      <Struk order={orders.find((o) => o.id === detailId)} warung={profile.name} onClose={() => setDetailId(null)} onStatus={setStatus} />

      {/* Bottom nav (HP) */}
      <nav className={`${BLUE} md:hidden fixed bottom-0 left-0 w-full rounded-t-[2rem] px-4 pt-4 pb-6 flex justify-around items-end z-30`}>
        {nav.map(({ k, l, i: Icon, center }) =>
          center ? (
            <button key={k} onClick={() => setTab(k)} className="relative -mt-12 flex flex-col items-center">
              <div className={`${YELLOW} w-16 h-16 rounded-full grid place-items-center border-4 border-[#eef1ff] relative`}>
                <Icon className="text-[#1428C8]" />
                {count("baru") > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full grid place-items-center">{count("baru")}</span>}
              </div>
              <span className={`text-[11px] mt-1 ${cur === k ? "text-[#EEFF5A] font-bold" : "text-white/70"}`}>{l}</span>
            </button>
          ) : (
            <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center gap-1 text-[11px] ${cur === k ? "text-[#EEFF5A] font-bold" : "text-white/70"}`}>
              <Icon size={20} />{l}
            </button>
          )
        )}
      </nav>
    </div>
  );
}