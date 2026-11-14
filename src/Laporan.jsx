import { useState } from "react";
import { X, CheckCircle2, Wallet } from "lucide-react";
import { rp, total, itemsText, Card } from "./shared";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BANK = ["BCA", "Mandiri", "BRI", "BNI", "BSI", "CIMB Niaga", "Permata"];
const ADMIN = 2500;
const MIN = 10000;
const input = "w-full bg-[#eef1ff] rounded-2xl px-4 py-3 text-sm outline-none";
const mask = (no) => "•••• " + no.slice(-4);
const sum = (l) => l.reduce((a, o) => a + total(o), 0);

export default function Laporan({ orders, saldo, wd, rek, onWithdraw, onOpen }) {
  const [topN, setTopN] = useState(5);
  const [modal, setModal] = useState(false);
  const [step, setStep] = useState("form");
  const [f, setF] = useState({ bank: "BCA", no: "", nama: "", amount: "" });
  const [err, setErr] = useState("");

  const selesai = orders.filter((o) => o.status === "selesai");

  const days = [6, 5, 4, 3, 2, 1, 0].map((d) => {
    const dt = new Date();
    dt.setDate(dt.getDate() - d);
    return { d, label: d === 0 ? "Hari ini" : HARI[dt.getDay()], v: sum(selesai.filter((o) => o.day === d)) };
  });
  const max = Math.max(...days.map((x) => x.v), 1);

  const m = {};
  selesai.forEach((o) => o.items.forEach((i) => {
    m[i.name] = m[i.name] || { name: i.name, qty: 0, rev: 0 };
    m[i.name].qty += i.qty;
    m[i.name].rev += i.qty * i.price;
  }));
  const top = Object.values(m).sort((a, b) => b.qty - a.qty).slice(0, topN);
  const topMax = Math.max(...top.map((t) => t.qty), 1);

  const openWd = () => {
    setF({ bank: rek.bank, no: rek.no, nama: rek.nama, amount: "" });
    setErr("");
    setStep("form");
    setModal(true);
  };

  const submit = () => {
    const amt = +f.amount;
    if (!/^\d{8,16}$/.test(f.no)) return setErr("Nomor rekening harus 8-16 angka");
    if (!f.nama.trim()) return setErr("Nama pemilik rekening wajib diisi");
    if (!amt || amt < MIN) return setErr(`Minimal penarikan ${rp(MIN)}`);
    if (amt > saldo) return setErr("Jumlah melebihi saldo");
    onWithdraw({ bank: f.bank, no: f.no, nama: f.nama.trim(), amount: amt });
    setStep("ok");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-[#1428C8] to-[#2F4BF2] text-white rounded-3xl shadow-[0_8px_24px_rgba(20,40,200,0.25)] p-5 md:p-6 flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs font-semibold opacity-80">SALDO WARUNG</p>
            <p className="text-3xl font-extrabold mt-1">{rp(saldo)}</p>
            <p className="text-xs opacity-80 mt-1">Dapat ditarik ke rekening pribadi</p>
          </div>
          <button onClick={openWd} className="bg-[#EEFF5A] text-[#1428C8] font-extrabold py-3 rounded-full flex items-center justify-center gap-2">
            <Wallet size={16} /> Tarik Saldo
          </button>
        </div>
        <Card>
          <p className="text-xs text-gray-400 font-semibold">OMZET HARI INI</p>
          <p className="text-3xl font-extrabold text-[#1428C8] mt-1">{rp(days[6].v)}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 font-semibold">TOTAL 7 HARI</p>
          <p className="text-3xl font-extrabold text-[#1428C8] mt-1">{rp(sum(selesai))}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="md:col-span-2">
          <p className="font-bold">Grafik Penjualan</p>
          <p className="text-xs text-gray-400">7 hari terakhir</p>
          <div className="mt-6 h-52 flex items-end gap-2 md:gap-4">
            {days.map((x) => (
              <div key={x.d} className="flex-1 min-w-0 flex flex-col items-center justify-end gap-1">
                <span className="text-[10px] font-bold text-gray-500">{x.v ? Math.round(x.v / 1000) + "rb" : "-"}</span>
                <div className={`w-full max-w-12 rounded-t-xl ${x.d === 0 ? "bg-[#1428C8]" : "bg-[#9fb0ff]"}`}
                  style={{ height: Math.max(6, (x.v / max) * 150) }} />
                <span className={`text-[11px] font-semibold ${x.d === 0 ? "text-[#1428C8]" : "text-gray-400"}`}>{x.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold">Menu Terlaris</p>
            <div className="bg-[#eef1ff] rounded-full p-1 flex">
              {[3, 5].map((n) => (
                <button key={n} onClick={() => setTopN(n)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full ${topN === n ? "bg-[#1428C8] text-white" : "text-gray-500"}`}>Top {n}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {top.length === 0 && <p className="text-sm text-gray-400">Belum ada penjualan.</p>}
            {top.map((t, idx) => (
              <div key={t.name}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-extrabold shrink-0 ${idx === 0 ? "bg-[#EEFF5A] text-[#1428C8]" : "bg-[#eef1ff] text-gray-500"}`}>{idx + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.qty} terjual · {rp(t.rev)}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-[#eef1ff] rounded-full mt-2">
                  <div className="h-full bg-[#1428C8] rounded-full" style={{ width: (t.qty / topMax) * 100 + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
        <Card>
          <p className="font-bold mb-3">Riwayat Penarikan</p>
          <div className="divide-y divide-gray-100">
            {wd.map((w) => (
              <div key={w.id} className="py-3 flex justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">{w.bank} {mask(w.no)}</p>
                  <p className="text-xs text-gray-400">{w.time} · <span className="text-green-600 font-semibold">Berhasil (demo)</span></p>
                </div>
                <p className="font-extrabold text-sm shrink-0">-{rp(w.amount)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-bold mb-3">Riwayat Transaksi</p>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {selesai.map((o) => (
              <button key={o.id} onClick={() => onOpen(o.id)} className="w-full py-3 flex justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="font-bold text-sm">{o.id}</p>
                  <p className="text-xs text-gray-400 truncate">{itemsText(o)}</p>
                </div>
                <p className="font-extrabold text-sm shrink-0">{rp(total(o))}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-lg">{step === "form" ? "Tarik Saldo" : "Penarikan Diproses"}</p>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-[#eef1ff] grid place-items-center"><X size={16} /></button>
            </div>

            {step === "form" ? (
              <>
                <div className="bg-[#eef1ff] rounded-2xl p-4">
                  <p className="text-[11px] font-bold text-gray-400">SALDO TERSEDIA</p>
                  <p className="text-2xl font-extrabold text-[#1428C8]">{rp(saldo)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Bank tujuan</p>
                  <select className={input} value={f.bank} onChange={(e) => setF({ ...f, bank: e.target.value })}>
                    {BANK.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Nomor rekening</p>
                  <input className={input} inputMode="numeric" placeholder="Contoh: 1234567890" value={f.no}
                    onChange={(e) => setF({ ...f, no: e.target.value.replace(/\D/g, "") })} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Nama pemilik rekening</p>
                  <input className={input} placeholder="Sesuai buku tabungan" value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-gray-500">Jumlah penarikan</p>
                    <button onClick={() => setF({ ...f, amount: String(saldo) })} className="text-xs font-bold text-[#1428C8]">Tarik semua</button>
                  </div>
                  <input className={input} type="number" placeholder={`Minimal ${MIN}`} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
                </div>
                <p className="text-xs text-gray-400">Biaya penarikan {rp(ADMIN)} (demo). Dana diterima: <b>{rp(Math.max(0, (+f.amount || 0) - ADMIN))}</b></p>
                {err && <p className="text-xs font-semibold text-red-500">{err}</p>}
                <button onClick={submit} className="bg-[#1428C8] text-white w-full py-3 rounded-full font-bold">Tarik Saldo</button>
              </>
            ) : (
              <div className="text-center space-y-3">
                <CheckCircle2 size={56} className="text-green-500 mx-auto" />
                <p className="font-extrabold text-xl">Penarikan Berhasil!</p>
                <p className="text-sm text-gray-500">Dana {rp(Math.max(0, +f.amount - ADMIN))} dikirim ke {f.bank} {mask(f.no)} a.n. {f.nama} (simulasi, tidak ada transaksi uang sungguhan).</p>
                <button onClick={() => setModal(false)} className="bg-[#1428C8] text-white w-full py-3 rounded-full font-bold">Selesai</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}