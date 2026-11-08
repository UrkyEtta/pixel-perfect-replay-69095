import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import hero from "@/assets/hero.jpg";
import { Isotipo, Logo, Sello, Wordmark } from "@/components/Brand";
import { useCart } from "@/lib/cart";
import {
  CATEGORIES,
  PRODUCTS,
  WHATSAPP_NUMBER,
  buildOrderMessage,
  formatCLP,
  whatsappUrl,
  type CategoryId,
  type OrderData,
} from "@/lib/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RAÍCES — Cocina Boliviana | Carta digital" },
      { name: "description", content: "Carta digital de RAÍCES, cocina boliviana en San Felipe. Pique macho, salteñas, sopa de maní y pedidos por WhatsApp." },
      { property: "og:title", content: "RAÍCES — Cocina Boliviana" },
      { property: "og:description", content: "El sabor de nuestra tierra. Explora la carta y arma tu pedido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Avenida Diego de Almagro, San Felipe, Valparaíso, Chile");

function Index() {
  const { cart, add, setQty, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryId | "todas">("todas");

  const lines = useMemo(
    () => PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ product: p, qty: cart[p.id] ?? 0 })),
    [cart],
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0);

  const q = query.trim().toLowerCase();
  const filtered = PRODUCTS.filter(
    (p) =>
      (cat === "todas" || p.category === cat) &&
      (!q || (p.name + " " + p.description).toLowerCase().includes(q)),
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-andino">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
          <a href="#inicio" aria-label="RAÍCES inicio"><Logo height={34} /></a>
          <nav className="hidden gap-5 text-sm font-semibold text-crema md:flex">
            <a href="#carta">Carta</a><a href="#historia">Historia</a><a href="#encuentranos">Encuéntranos</a>
          </nav>
          <button onClick={() => setOpen(true)} className="relative rounded-full border-2 border-cacao bg-maiz px-3.5 py-2 font-display text-cacao shadow-block-sm" aria-label={`Ver pedido, ${count} productos`}>
            Pedido
            {count > 0 && <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full border-2 border-cacao bg-crema px-1 text-xs">{count}</span>}
          </button>
        </div>
        <div className="terrace-band" />
      </header>

      {/* Hero */}
      <section id="inicio" className="terrace-field relative overflow-hidden bg-andino pb-14 pt-6">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 md:grid-cols-2">
          <div className="relative order-2 md:order-1">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-maiz">San Felipe · Cocina Boliviana</p>
            <h1 className="text-5xl leading-[0.95] text-crema md:text-6xl">
              El sabor de<br /><span className="text-maiz">nuestra tierra</span>
            </h1>
            <p className="mt-4 max-w-sm text-crema/85">Recetas de casa, fuego lento y porciones generosas. Arma tu pedido y envíalo en segundos.</p>
            <a href="#carta" className="btn-maiz mt-6">Explorar la carta</a>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="overflow-hidden rounded-[2rem] border-[3px] border-cacao shadow-block">
              <img src={hero} alt="Pique macho servido en plato de cerámica artesanal" width={1280} height={960} className="aspect-[4/3] w-full object-cover" />
            </div>
            <Sello className="absolute -bottom-8 -left-3 h-28 w-28 animate-[spin_30s_linear_infinite] drop-shadow-lg" />
          </div>
        </div>
      </section>
      <div className="terrace-band terrace-band-andino terrace-flip" />

      {/* Carta */}
      <section id="carta" className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-4xl text-andino">Nuestra carta</h2>
        <label className="mt-4 flex items-center gap-2 rounded-full border-2 border-cacao bg-card px-4 py-3 shadow-block-sm">
          <span aria-hidden>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar plato, bebida…" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" aria-label="Buscar en la carta" />
        </label>
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {[{ id: "todas" as const, label: "Todas" }, ...CATEGORIES].map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full border-2 border-cacao px-4 py-2 font-display text-sm ${cat === c.id ? "bg-andino text-crema" : "bg-card text-cacao"}`}>
              {c.label}
            </button>
          ))}
        </div>

        {CATEGORIES.filter((c) => cat === "todas" || cat === c.id).map((c) => {
          const items = filtered.filter((p) => p.category === c.id);
          if (!items.length) return null;
          const promo = c.id === "promociones";
          return (
            <div key={c.id} className="mt-8">
              <div className="mb-4 flex items-center gap-3">
                <Isotipo size={30} />
                <h3 className="text-2xl text-cacao">{c.label}</h3>
                <div className="terrace-band h-3 flex-1 opacity-60" style={{ backgroundColor: "var(--arcilla)" }} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <article key={p.id} className={`flex overflow-hidden rounded-2xl border-[2.5px] border-cacao shadow-block sm:flex-col ${promo ? "bg-maiz" : "bg-card"}`}>
                    <img src={p.image} alt={p.name} loading="lazy" width={944} height={704} className="w-28 shrink-0 object-cover sm:aspect-[4/3] sm:w-full" />
                    <div className="flex flex-1 flex-col p-3">
                      <h4 className="font-display text-lg leading-tight">{p.name}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <span className="text-lg font-bold">{formatCLP(p.price)}</span>
                        <button onClick={() => add(p.id)} className="btn-andino px-4 text-sm" aria-label={`Agregar ${p.name}`}>
                          {cart[p.id] ? `+ (${cart[p.id]})` : "+ Agregar"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
        {!filtered.length && <p className="mt-8 text-center text-muted-foreground">No encontramos “{query}”. Prueba con otra palabra.</p>}
      </section>

      {/* Historia */}
      <div className="terrace-band terrace-band-andino" />
      <section id="historia" className="terrace-field bg-andino px-4 py-12 text-crema">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl text-maiz">Nuestra historia</h2>
          <p className="mt-4 leading-relaxed text-crema/90">
            La cocina boliviana nace del encuentro entre altiplano, valles y llanos: maíz, papa, chuño, maní y ají que se transmiten de generación en generación.
            RAÍCES es un homenaje a esa herencia — mesas largas, ollas de barro y el gusto de compartir un plato contundente.
          </p>
        </div>
      </section>
      <div className="terrace-band terrace-band-andino terrace-flip" />

      {/* Encuéntranos + QR */}
      <section id="encuentranos" className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-2">
        <div className="rounded-3xl border-[2.5px] border-cacao bg-card p-6 shadow-block">
          <h2 className="text-3xl text-andino">Encuéntranos</h2>
          <p className="mt-3 font-semibold">Avenida Diego de Almagro</p>
          <p className="text-muted-foreground">San Felipe, Región de Valparaíso, Chile</p>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn-maiz mt-5">Cómo llegar</a>
        </div>
        <QrCard />
      </section>

      {/* Footer */}
      <footer className="bg-cacao text-crema">
        <div className="terrace-band" />
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-10 text-center">
          <Wordmark height={56} />
          <p className="font-display text-maiz">Cocina Boliviana</p>
          <p className="text-xs text-crema/60">Proyecto demostrativo — Restaurante ficticio. Imágenes generadas con fines ilustrativos.</p>
        </div>
      </footer>

      {/* Floating cart */}
      {count > 0 && !open && (
        <button onClick={() => setOpen(true)} className="btn-maiz fixed bottom-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap">
          Ver pedido · {count} · {formatCLP(total)}
        </button>
      )}

      {open && <CartPanel lines={lines} total={total} setQty={setQty} clear={clear} onClose={() => setOpen(false)} />}
    </div>
  );
}

function CartPanel({ lines, total, setQty, clear, onClose }: {
  lines: { product: (typeof PRODUCTS)[number]; qty: number }[];
  total: number;
  setQty: (id: string, q: number) => void;
  clear: () => void;
  onClose: () => void;
}) {
  const [data, setData] = useState<OrderData>({ name: "", mode: "retiro", address: "", notes: "" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  const valid = lines.length > 0 && data.name.trim() && (data.mode === "retiro" || data.address.trim());
  const msg = buildOrderMessage(lines, data);

  const send = async () => {
    if (!valid) return setNotice("Completa tu nombre" + (data.mode === "delivery" ? " y dirección." : "."));
    if (WHATSAPP_NUMBER) {
      window.open(whatsappUrl(WHATSAPP_NUMBER, msg), "_blank", "noopener");
    } else {
      try { await navigator.clipboard.writeText(msg); setNotice("WhatsApp aún no está configurado. Copiamos tu pedido al portapapeles."); }
      catch { setNotice("WhatsApp aún no está configurado. Copia el pedido manualmente."); }
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(msg); setNotice("Pedido copiado."); } catch { setNotice("No se pudo copiar."); }
  };

  const field = "w-full rounded-xl border-2 border-cacao bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-cacao/60" onClick={onClose} role="dialog" aria-modal="true" aria-label="Tu pedido">
      <div className="flex h-full w-full max-w-md flex-col bg-crema" onClick={(e) => e.stopPropagation()}>
        <div className="bg-andino">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-2xl text-maiz">Tu pedido</h2>
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border-2 border-cacao bg-maiz font-display text-cacao" aria-label="Cerrar">✕</button>
          </div>
          <div className="terrace-band" />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {!lines.length && <p className="py-10 text-center text-muted-foreground">Tu pedido está vacío.</p>}
          <ul className="space-y-3">
            {lines.map(({ product: p, qty }) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border-2 border-cacao bg-card p-2">
                <img src={p.image} alt="" width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCLP(p.price)} c/u</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setQty(p.id, qty - 1)} className="h-9 w-9 rounded-full border-2 border-cacao bg-maiz font-bold" aria-label={`Quitar uno de ${p.name}`}>−</button>
                  <span className="w-6 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty(p.id, qty + 1)} className="h-9 w-9 rounded-full border-2 border-cacao bg-maiz font-bold" aria-label={`Agregar uno de ${p.name}`}>+</button>
                </div>
              </li>
            ))}
          </ul>
          {lines.length > 0 && (
            <>
              <div className="mt-4 space-y-1 border-t-2 border-dashed border-cacao/40 pt-3">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCLP(total)}</span></div>
                <div className="flex justify-between font-display text-xl"><span>Total</span><span>{formatCLP(total)}</span></div>
                <button onClick={clear} className="text-xs text-muted-foreground underline">Vaciar pedido</button>
              </div>
              <div className="mt-5 space-y-3">
                <input className={field} placeholder="Tu nombre" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} aria-label="Nombre" />
                <div className="grid grid-cols-2 gap-2">
                  {(["retiro", "delivery"] as const).map((m) => (
                    <button key={m} onClick={() => setData({ ...data, mode: m })} className={`rounded-xl border-2 border-cacao py-3 font-display ${data.mode === m ? "bg-andino text-crema" : "bg-card"}`}>
                      {m === "retiro" ? "Retiro" : "Delivery"}
                    </button>
                  ))}
                </div>
                {data.mode === "delivery" && (
                  <input className={field} placeholder="Dirección de entrega" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} aria-label="Dirección" />
                )}
                <textarea className={field} rows={2} placeholder="Observaciones (opcional)" value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} aria-label="Observaciones" />
              </div>
            </>
          )}
          {notice && <p role="status" className="mt-3 rounded-xl border-2 border-arcilla bg-maiz/30 p-3 text-sm">{notice}</p>}
        </div>
        {lines.length > 0 && (
          <div className="flex gap-2 border-t-2 border-cacao p-4">
            <button onClick={copy} className="btn-andino flex-1 text-sm">Copiar</button>
            <button onClick={send} className="btn-maiz flex-[2] text-base">{WHATSAPP_NUMBER ? "Enviar por WhatsApp" : "Pedir por WhatsApp"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function QrCard() {
  const [url, setUrl] = useState<string | null>(null);
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    const { protocol, hostname, origin, pathname } = window.location;
    const local = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");
    if (protocol === "https:" && !local) {
      const u = origin + pathname;
      setUrl(u);
      QRCode.toDataURL(u, { width: 512, margin: 2, color: { dark: "#39231B", light: "#F6E8CB" } }).then(setImg).catch(() => {});
    }
  }, []);

  return (
    <div className="flex flex-col items-center rounded-3xl border-[2.5px] border-cacao bg-maiz p-6 text-center shadow-block">
      <h2 className="text-3xl text-cacao">Escanea la carta</h2>
      <div className="mt-4 rounded-2xl border-[3px] border-cacao bg-crema p-2">
        {img ? (
          <img src={img} alt="Código QR de la carta" width={176} height={176} className="h-44 w-44" />
        ) : (
          <div className="grid h-44 w-44 place-items-center terrace-field bg-andino text-sm text-crema">QR disponible al publicar</div>
        )}
      </div>
      {img && url && (
        <a href={img} download="raices-qr.png" className="btn-andino mt-4 text-sm">Descargar QR</a>
      )}
    </div>
  );
}
