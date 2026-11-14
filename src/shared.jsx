export const BLUE = "bg-[#1428C8]";
export const YELLOW = "bg-[#EEFF5A]";
export const FEE = 1000;

export const rp = (n) => "Rp " + n.toLocaleString("id-ID");
export const subtotal = (o) => o.items.reduce((a, i) => a + i.qty * i.price, 0);
export const total = (o) => subtotal(o) + FEE - (o.diskon || 0);
export const itemsText = (o) => o.items.map((i) => `${i.name} x${i.qty}`).join(", ");

export const Card = ({ children, className = "", ...rest }) => (
  <div {...rest} className={`bg-white rounded-3xl shadow-[0_8px_24px_rgba(20,40,200,0.10)] p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

export const Page = ({ label, title, right, children }) => (
  <>
    <div className="bg-gradient-to-r from-[#1428C8] to-[#2F4BF2] text-white rounded-b-[2rem] md:rounded-none">
      <div className="max-w-6xl mx-auto px-5 md:px-6 h-24 md:h-28 flex items-center justify-between">
        <div className="leading-tight">
          <p className="text-[#EEFF5A] text-[10px] md:text-xs font-semibold tracking-wide uppercase">{label}</p>
          <h1 className="text-xl md:text-3xl font-extrabold mt-0.5">{title}</h1>
        </div>
        {right}
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-3 md:space-y-6">{children}</div>
  </>
);