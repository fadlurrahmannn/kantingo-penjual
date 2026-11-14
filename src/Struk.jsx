import { X } from "lucide-react";
import { rp, subtotal, total, FEE } from "./shared";

const LABEL = { baru: "Baru", diproses: "Diproses", siap: "Siap Diambil", selesai: "Selesai" };
const MSG = {
  baru: ["Pesanan Baru Masuk", "Terima pesanan agar mulai disiapkan."],
  diproses: ["Sedang Disiapkan", "Tandai siap diambil setelah pesanan selesai dibuat."],
  siap: ["Pesanan Siap Diambil", "Minta pembeli menunjukkan nomor antrean saat mengambil makanan."],
  selesai: ["Pesanan Selesai", "Pesanan sudah diambil pembeli dan dana masuk ke saldo warung."],
};
const BOX = {
  baru: "bg-blue-50 border-blue-200 text-blue-800",
  diproses: "bg-orange-50 border-orange-200 text-orange-800",
  siap: "bg-green-50 border-green-200 text-green-800",
  selesai: "bg-gray-50 border-gray-200 text-gray-700",
};
const NEXT = {
  baru: ["Terima Pesanan", "diproses"],
  diproses: ["Tandai Siap Diambil", "siap"],
  siap: ["Pesanan Sudah Diambil", "selesai"],
};

export default function Struk({ order, warung, onClose, onStatus }) {
  if (!order) return null;
  const next = NEXT[order.status];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#1428C8] to-[#2F4BF2] text-white px-5 py-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold opacity-80">MITRA KANTIN</p>
            <p className="font-extrabold truncate">{warung}</p>
          </div>
          <span className="bg-[#EEFF5A] text-[#1428C8] text-xs font-extrabold px-3 py-1 rounded-full shrink-0">{LABEL[order.status]}</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 grid place-items-center shrink-0"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="bg-[#eef1ff] rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider">NOMOR ANTREAN / KODE PESANAN</p>
            <p className="text-2xl font-extrabold text-[#1428C8] mt-1">{order.id}</p>
            <span className="inline-block mt-2 bg-white text-xs px-3 py-1 rounded-full">
              Pengambilan: <b className="text-green-600">{order.pickup}</b>
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">DAFTAR MENU ({order.items.length})</p>
            <div className="divide-y divide-gray-100">
              {order.items.map((i) => (
                <div key={i.name} className="py-3 flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{i.name}</p>
                    {i.opt && <p className="text-xs text-gray-500">{i.opt}</p>}
                    {i.note && <p className="text-xs italic text-gray-400">Catatan: "{i.note}"</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-gray-400">{i.qty}x {rp(i.price)}</p>
                    <p className="font-extrabold text-sm">{rp(i.qty * i.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><b className="text-gray-800">{rp(subtotal(order))}</b></div>
            {order.diskon > 0 && (
              <div className="flex justify-between text-green-600"><span>Diskon Voucher</span><b>-{rp(order.diskon)}</b></div>
            )}
            <div className="flex justify-between text-gray-500"><span>Biaya Layanan</span><b className="text-gray-800">{rp(FEE)}</b></div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-extrabold">Total Pembayaran</span>
              <span className="font-extrabold text-xl text-[#1428C8]">{rp(total(order))}</span>
            </div>
          </div>

          <div className={`rounded-2xl border p-3 ${BOX[order.status]}`}>
            <p className="font-bold text-sm">{MSG[order.status][0]}</p>
            <p className="text-xs">{MSG[order.status][1]}</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          {next ? (
            <button onClick={() => onStatus(order.id, next[1])} className="bg-[#1428C8] text-white w-full py-3.5 rounded-full font-bold shadow-lg">{next[0]}</button>
          ) : (
            <button onClick={onClose} className="bg-gray-100 w-full py-3.5 rounded-full font-bold">Tutup</button>
          )}
        </div>
      </div>
    </div>
  );
}