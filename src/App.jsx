import { useState } from "react";
import { Home, UtensilsCrossed, ClipboardList, BarChart3, User, Store, Plus, Bell } from "lucide-react";

const BLUE = "bg-[#1428C8]";
const YELLOW = "bg-[#EEFF5A]";
const rp = (n) => "Rp " + n.toLocaleString("id-ID");

const initOrders = [
  { id: "KGO-8921", items: "Ayam Geprek Sambal Matah x2, Es Teh Manis Jumbo", total: 43000, pickup: "Secepatnya (±10 mnt)", note: "Sambal matah dipisah ya bu", status: "baru" },
  { id: "KGO-7306", items: "Kopi Susu Gula Aren Barista x3", total: 37000, pickup: "+15 menit (01:37)", status: "baru" },
  { id: "KGO-6120", items: "Nasi Goreng Spesial x1", total: 16000, pickup: "Secepatnya (±10 mnt)", status: "selesai" },
  { id: "KGO-5544", items: "Matcha Latte Creamy Ice x2", total: 29000, pickup: "+30 menit", status: "selesai" },
];

const initMenu = [
  { id: 1, name: "Kopi Susu Gula Aren Barista", price: 12000, ready: true },
  { id: 2, name: "Matcha Latte Creamy Ice", price: 14000, ready: true },
  { id: 3, name: "Roti Bakar Coklat Keju", price: 10000, ready: false },
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-lg shadow-blue-900/5 p-5 md:p-6 ${className}`}>{children}</div>
);

const Page = ({ label, title, right, children }) => (
  <>
    <div className="bg-gradient-to-r from-[#1428C8] to-[#2F4BF2] text-white rounded-b-[2rem] md:rounded-none">
      <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-10 pb-8 md:pb-12 flex items-end justify-between">
        <div>
          <p className="text-[#EEFF5A] text-xs font-semibold tracking-wide uppercase">{label}</p>
          <h1 className="text-2xl md:text-4xl font-extrabold">{title}</h1>
        </div>
        {right}
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-5 md:px-6 py-5 md:py-8 space-y-4 md:space-y-6">{children}</div>
  </>
);

const nextAction = { baru: ["Terima Pesanan", "diproses"], diproses: ["Tandai Siap Diambil", "siap"], siap: ["Pesanan Diambil", "selesai"] };
const badge = {
  baru: "bg-blue-50 text-blue-700 border-blue-200",
  diproses: "bg-orange-50 text-orange-700 border-orange-200",
  siap: "bg-green-50 text-green-700 border-green-200",
  selesai: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function App() {
  const [tab, setTab] = useState("beranda");
  const [open, setOpen] = useState(true);
  const [orders, setOrders] = useState(initOrders);
  const [menu, setMenu] = useState(initMenu);
  const [filter, setFilter] = useState("baru");
  const [form, setForm] = useState({ name: "", price: "" });

  const advance = (id, status) => setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  const count = (s) => orders.filter((o) => o.status === s).length;
  const selesai = orders.filter((o) => o.status === "selesai");
  const omzet = selesai.reduce((a, o) => a + o.total, 0);

  const addMenu = () => {
    if (!form.name || !form.price) return;
    setMenu([...menu, { id: Date.now(), name: form.name, price: +form.price, ready: true }]);
    setForm({ name: "", price: "" });
  };

  const nav = [
    { k: "beranda", l: "Beranda", i: Home },
    { k: "menu", l: "Menu", i: UtensilsCrossed },
    { k: "pesanan", l: "Pesanan", i: ClipboardList, center: true },
    { k: "laporan", l: "Laporan", i: BarChart3 },
    { k: "profil", l: "Profil", i: User },
  ];

  const input = "w-full bg-[#eef1ff] rounded-2xl px-4 py-3 text-sm outline-none";

  return (
    <div className="min-h-screen pb-32 md:pb-0">
      {/* Navbar atas (desktop) */}
      <header className={`${BLUE} hidden md:block sticky top-0 z-20`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <p className="text-white text-2xl font-extrabold">
            Kantin<span className="text-[#EEFF5A]">GO</span>
            <span className="ml-2 text-xs font-semibold bg-white/15 px-2 py-1 rounded-full align-middle">Penjual</span>
          </p>
          <nav className="flex items-center gap-2">
            {nav.map(({ k, l, i: Icon, center }) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  center ? `${YELLOW} text-[#1428C8]` : tab === k ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
                } ${center && tab === k ? "ring-2 ring-white" : ""}`}>
                <Icon size={16} /> {l}
                {center && count("baru") > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full grid place-items-center">{count("baru")}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {tab === "beranda" && (
        <Page label="Dashboard Penjual" title="Kedai Kopi Kampus 2.0"
          right={<button className="w-10 h-10 rounded-full bg-white/20 grid place-items-center"><Bell size={18} /></button>}>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Card className="flex items-center justify-between">
              <div>
                <p className="font-bold">Status Warung</p>
                <p className={`text-sm font-semibold ${open ? "text-green-600" : "text-red-500"}`}>{open ? "Buka · menerima pesanan" : "Tutup"}</p>
              </div>
              <button onClick={() => setOpen(!open)} className={`w-14 h-8 rounded-full p-1 transition ${open ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`w-6 h-6 bg-white rounded-full transition ${open ? "translate-x-6" : ""}`} />
              </button>
            </Card>
            <Card><p className="text-xs text-gray-400 font-semibold">PESANAN BARU</p><p className="text-3xl font-extrabold mt-1">{count("baru")}</p></Card>
            <Card><p className="text-xs text-gray-400 font-semibold">DIPROSES</p><p className="text-3xl font-extrabold mt-1">{count("diproses")}</p></Card>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Card className="md:col-span-2">
              <p className="text-xs text-gray-400 font-semibold">OMZET HARI INI</p>
              <p className="text-3xl md:text-4xl font-extrabold text-[#1428C8] mt-1">{rp(omzet)}</p>
              <p className="text-xs text-gray-400 mt-1">{selesai.length} pesanan selesai</p>
            </Card>
            <button onClick={() => setTab("pesanan")} className={`${BLUE} text-white w-full py-4 rounded-3xl font-bold shadow-lg`}>Lihat Pesanan Masuk →</button>
          </div>
        </Page>
      )}

      {tab === "pesanan" && (
        <Page label="Aktivitas Pesanan" title="Pesanan Masuk">
          <div className="bg-white rounded-2xl p-1.5 flex gap-1 md:max-w-xl">
            {["baru", "diproses", "siap", "selesai"].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`flex-1 py-2 rounded-xl text-xs md:text-sm font-bold capitalize ${filter === s ? BLUE + " text-white" : "text-gray-500"}`}>
                {s} {count(s) > 0 && `(${count(s)})`}
              </button>
            ))}
          </div>
          {orders.filter((o) => o.status === filter).length === 0 && (
            <Card className="text-center text-gray-400 text-sm">Belum ada pesanan di sini.</Card>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {orders.filter((o) => o.status === filter).map((o) => (
              <Card key={o.id} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div><p className="text-[10px] text-gray-400 font-semibold">KODE PESANAN</p><p className="font-extrabold">{o.id}</p></div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${badge[o.status]}`}>{o.status}</span>
                </div>
                <p className="font-semibold text-sm">{o.items}</p>
                {o.note && <p className="text-xs italic text-gray-500">Catatan: "{o.note}"</p>}
                <p className="text-xs text-gray-500">Pengambilan: <b className="text-green-600">{o.pickup}</b></p>
                <div className="flex justify-between items-center border-t pt-3">
                  <p className="font-extrabold text-[#1428C8]">{rp(o.total)}</p>
                  {nextAction[o.status] && (
                    <button onClick={() => advance(o.id, nextAction[o.status][1])} className={`${BLUE} text-white text-xs font-bold px-4 py-2 rounded-full`}>
                      {nextAction[o.status][0]}
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Page>
      )}

      {tab === "menu" && (
        <Page label="Kelola Dagangan" title="Menu Saya">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-start">
            <Card className="space-y-3 md:sticky md:top-24">
              <p className="font-bold">Tambah Menu Baru</p>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama menu" className={input} />
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Harga (contoh: 12000)" type="number" className={input} />
              <button onClick={addMenu} className={`${BLUE} text-white w-full py-3 rounded-full font-bold flex items-center justify-center gap-2`}><Plus size={16} /> Tambah</button>
            </Card>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4 md:gap-6">
              {menu.map((m) => (
                <Card key={m.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm">{m.name}</p>
                    <p className="text-[#1428C8] font-extrabold text-sm">{rp(m.price)}</p>
                  </div>
                  <button onClick={() => setMenu(menu.map((x) => (x.id === m.id ? { ...x, ready: !x.ready } : x)))}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${m.ready ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {m.ready ? "Tersedia" : "Habis"}
                  </button>
                </Card>
              ))}
            </div>
          </div>
        </Page>
      )}

      {tab === "laporan" && (
        <Page label="Ringkasan" title="Laporan Penjualan">
          <Card>
            <p className="text-xs text-gray-400 font-semibold">TOTAL PENDAPATAN</p>
            <p className="text-3xl md:text-4xl font-extrabold text-[#1428C8]">{rp(omzet)}</p>
          </Card>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {selesai.map((o) => (
              <Card key={o.id} className="flex justify-between items-center gap-3">
                <div><p className="font-bold text-sm">{o.id}</p><p className="text-xs text-gray-400">{o.items}</p></div>
                <p className="font-extrabold text-sm shrink-0">{rp(o.total)}</p>
              </Card>
            ))}
          </div>
        </Page>
      )}

      {tab === "profil" && (
        <Page label="Akun Mitra" title="Profil Warung">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Card className="md:col-span-2 flex items-center gap-4">
              <div className={`${BLUE} w-16 h-16 rounded-2xl grid place-items-center text-white`}><Store /></div>
              <div>
                <p className="font-extrabold">Kedai Kopi Kampus 2.0</p>
                <p className="text-xs text-gray-500">Kantin Pusat, Sayap Barat</p>
                <p className="text-xs text-gray-500">Jam buka 07:30 - 19:00</p>
              </div>
            </Card>
            <Card className="flex items-center justify-between"><p className="font-semibold text-sm">Rating</p><p className="font-extrabold">⭐ 4.8 (6 ulasan)</p></Card>
          </div>
          <button className="w-full md:w-auto md:px-10 py-3 rounded-full bg-white text-red-500 font-bold shadow">Keluar</button>
        </Page>
      )}

      {/* Bottom nav (HP) */}
      <nav className={`${BLUE} md:hidden fixed bottom-0 left-0 w-full rounded-t-[2rem] px-4 pt-4 pb-6 flex justify-around items-end z-30`}>
        {nav.map(({ k, l, i: Icon, center }) =>
          center ? (
            <button key={k} onClick={() => setTab(k)} className="relative -mt-12 flex flex-col items-center">
              <div className={`${YELLOW} w-16 h-16 rounded-full grid place-items-center border-4 border-[#eef1ff] relative`}>
                <Icon className="text-[#1428C8]" />
                {count("baru") > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full grid place-items-center">{count("baru")}</span>}
              </div>
              <span className={`text-[11px] mt-1 ${tab === k ? "text-[#EEFF5A] font-bold" : "text-white/70"}`}>{l}</span>
            </button>
          ) : (
            <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center gap-1 text-[11px] ${tab === k ? "text-[#EEFF5A] font-bold" : "text-white/70"}`}>
              <Icon size={20} />{l}
            </button>
          )
        )}
      </nav>
    </div>
  );
}