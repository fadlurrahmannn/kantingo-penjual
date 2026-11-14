import { ArrowLeft, CircleHelp, FileText, Mail, Phone, Sparkles } from "lucide-react";
import { Card } from "./shared";

const Head = ({ icon: Icon, title, sub }) => (
  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-100">
    <div className="w-10 h-10 rounded-2xl bg-[#eef1ff] text-[#1428C8] grid place-items-center shrink-0"><Icon size={18} /></div>
    <div>
      <p className="font-extrabold">{title}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  </div>
);

const Item = ({ q, children }) => (
  <div className="py-3 border-b border-gray-100 last:border-0">
    <p className="font-bold text-sm">{q}</p>
    <p className="text-xs text-gray-500 leading-relaxed mt-1">{children}</p>
  </div>
);

const Bantuan = () => (
  <Card>
    <Head icon={CircleHelp} title="Pertanyaan Umum (FAQ)" sub="Panduan praktis mengelola warung di KantinGO" />
    <Item q="Bagaimana cara menerima pesanan?">
      Buka menu <b>Pesanan</b>, ketuk tombol <b>Terima Pesanan</b> pada pesanan baru. Stok menu akan berkurang otomatis sesuai jumlah yang dipesan.
    </Item>
    <Item q="Bagaimana cara menandai pesanan siap diambil?">
      Setelah makanan selesai dibuat, ketuk <b>Tandai Siap Diambil</b>. Pembeli akan mendapat notifikasi dan datang ke counter dengan menunjukkan nomor antrean.
    </Item>
    <Item q="Bagaimana mengatur stok dan ketersediaan menu?">
      Di menu <b>Menu</b>, gunakan tombol + / − untuk mengubah stok. Menu dengan stok 0 otomatis berstatus Habis dan tidak bisa dipesan pembeli.
    </Item>
    <Item q="Kapan saldo bisa ditarik?">
      Saldo bertambah setiap pesanan berstatus Selesai. Penarikan ke rekening pribadi dilakukan di menu <b>Laporan</b> dengan minimal penarikan Rp10.000.
    </Item>
    <Item q="Bagaimana jika ada kendala dengan pesanan?">
      Hubungi tim bantuan KantinGO melalui kanal di bawah ini, sertakan kode pesanan agar cepat ditangani.
    </Item>
    <div className="mt-4 bg-[#eef1ff] rounded-2xl p-4 space-y-2">
      <p className="text-[11px] font-extrabold tracking-wider">HUBUNGI LAYANAN MITRA</p>
      <p className="text-xs text-gray-600 flex items-center gap-2"><Mail size={14} className="text-[#1428C8]" /> support@kantingo.campus.id</p>
      <p className="text-xs text-gray-600 flex items-center gap-2"><Phone size={14} className="text-[#1428C8]" /> WhatsApp Helpdesk: +62 812-3456-2000</p>
    </div>
  </Card>
);

const Syarat = () => (
  <Card>
    <Head icon={FileText} title="Ketentuan Mitra" sub="Pembaruan terakhir: November 2026" />
    <Item q="1. Mitra Kantin Resmi">
      Layanan KantinGO Penjual diperuntukkan bagi pengelola warung kantin kampus yang telah terdaftar sebagai mitra untuk menerima pesanan tanpa antrean fisik yang panjang.
    </Item>
    <Item q="2. Ketepatan Waktu Penyajian">
      Mitra wajib menyiapkan pesanan sesuai waktu pengambilan yang dipilih pembeli agar kualitas dan kehangatan makanan tetap optimal.
    </Item>
    <Item q="3. Akurasi Menu, Harga & Stok">
      Mitra bertanggung jawab menjaga daftar menu, harga, dan stok tetap akurat. Menu yang habis harus segera ditandai Habis.
    </Item>
    <Item q="4. Pembayaran & Penarikan Saldo">
      Setiap transaksi QRIS yang telah diverifikasi bersifat final. Dana dari pesanan selesai masuk ke saldo warung dan dapat ditarik ke rekening atas nama pemilik warung.
    </Item>
    <Item q="5. Kebersihan & Higienitas">
      Bahan, rasa, dan higienitas menu makanan merupakan tanggung jawab masing-masing mitra kantin.
    </Item>
  </Card>
);

const Tentang = () => (
  <Card className="text-center">
    <div className="w-20 h-20 rounded-3xl bg-[#1428C8] grid place-items-center mx-auto shadow-lg">
      <p className="text-white font-extrabold text-xl">K<span className="text-[#EEFF5A]">GO</span></p>
    </div>
    <p className="text-2xl mt-3"><span className="text-[#1428C8]">Kantin</span><b className="text-[#1428C8]">GO</b></p>
    <span className="inline-block mt-2 text-[11px] font-bold bg-[#eef1ff] text-[#1428C8] px-3 py-1 rounded-full">
      Versi Prototype 1.0 (Technopreneurship) · Mitra Penjual
    </span>
    <div className="text-left text-xs text-gray-600 leading-relaxed space-y-3 mt-5">
      <p>
        <b>KantinGO</b> adalah aplikasi pemesanan makanan berbasis web progresif yang dirancang untuk mengatasi antrean panjang di kantin kampus, meningkatkan efisiensi waktu istirahat mahasiswa, serta mendukung digitalisasi UMKM mitra kantin.
      </p>
      <p>
        Melalui dashboard penjual, mitra dapat menerima dan memproses pesanan secara real-time, mengelola menu dan stok, memantau laporan penjualan, serta menarik saldo ke rekening pribadi.
      </p>
    </div>
    <div className="text-left bg-[#eef1ff] rounded-2xl p-4 mt-5">
      <p className="text-[11px] font-extrabold text-[#1428C8] tracking-wider flex items-center gap-2"><Sparkles size={13} /> KARYA TECHNOPRENEURSHIP - KELOMPOK 1</p>
      <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc pl-4">
        <li>Muhammad Athar Rizwan Alfaiz</li>
        <li>Jeremy Hasintongan</li>
        <li>Muhammad Reis Rajoana Atallah</li>
        <li>Radhitya Fadlurrahman Johari</li>
        <li>Desvia Maharani Kurniawan</li>
      </ul>
    </div>
  </Card>
);

export default function Info({ k, onBack }) {
  return (
    <div className="max-w-xl mx-auto px-5 py-6 md:py-10">
      <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-[0_8px_24px_rgba(20,40,200,0.10)] grid place-items-center mb-4">
        <ArrowLeft size={18} />
      </button>
      {k === "bantuan" && <Bantuan />}
      {k === "syarat" && <Syarat />}
      {k === "tentang" && <Tentang />}
    </div>
  );
}