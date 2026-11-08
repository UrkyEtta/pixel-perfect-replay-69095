import hero from "@/assets/hero.jpg";
import saltena from "@/assets/saltena.jpg";
import sopa from "@/assets/sopa.jpg";
import bebida from "@/assets/bebida.jpg";

/** Número de WhatsApp en formato internacional sin "+" (ej: "56912345678"). Vacío = sin configurar. */
export const WHATSAPP_NUMBER = "";

export type CategoryId = "especialidades" | "sopas" | "entradas" | "bebidas" | "promociones";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "especialidades", label: "Especialidades" },
  { id: "sopas", label: "Sopas" },
  { id: "entradas", label: "Entradas" },
  { id: "bebidas", label: "Bebidas" },
  { id: "promociones", label: "Promociones" },
];

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
};

export const PRODUCTS: Product[] = [
  { id: "pique-macho", name: "Pique Macho", description: "Carne, salchicha, papas fritas, huevo y vegetales.", price: 12990, category: "especialidades", image: hero },
  { id: "silpancho", name: "Silpancho", description: "Carne apanada, arroz, papas, huevo y ensalada.", price: 9990, category: "especialidades", image: hero },
  { id: "charquekan", name: "Charquekan", description: "Charque, mote, papa, huevo y queso.", price: 11990, category: "especialidades", image: hero },
  { id: "majadito", name: "Majadito", description: "Arroz con carne, huevo y plátano.", price: 9490, category: "especialidades", image: hero },
  { id: "fricase", name: "Fricasé", description: "Cerdo con ají amarillo, mote y chuño.", price: 10990, category: "especialidades", image: sopa },
  { id: "sopa-mani", name: "Sopa de Maní", description: "Cremosa sopa de maní con papas fritas y perejil.", price: 6990, category: "sopas", image: sopa },
  { id: "chairo", name: "Chairo", description: "Sopa paceña de chuño, carne y verduras.", price: 6490, category: "sopas", image: sopa },
  { id: "saltena-carne", name: "Salteña de carne", description: "Masa dorada rellena de jugoso guiso de carne.", price: 2990, category: "entradas", image: saltena },
  { id: "saltena-pollo", name: "Salteña de pollo", description: "Masa dorada rellena de guiso de pollo.", price: 2990, category: "entradas", image: saltena },
  { id: "cunape", name: "Cuñapé", description: "Panecillo de almidón de yuca y queso.", price: 2490, category: "entradas", image: saltena },
  { id: "mocochinchi", name: "Mocochinchi", description: "Refresco de durazno deshidratado y canela.", price: 2990, category: "bebidas", image: bebida },
  { id: "somo", name: "Somó", description: "Bebida tradicional de maíz.", price: 2990, category: "bebidas", image: bebida },
  { id: "limonada", name: "Limonada", description: "Limonada natural.", price: 2490, category: "bebidas", image: bebida },
  { id: "menu-raices", name: "Menú Raíces", description: "Sopa de maní, silpancho y bebida.", price: 13990, category: "promociones", image: sopa },
  { id: "duo-saltenero", name: "Dúo Salteñero", description: "Dos salteñas y bebida.", price: 6990, category: "promociones", image: saltena },
];

export const formatCLP = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-CL", { maximumFractionDigits: 0 });

export type CartLine = { product: Product; qty: number };
export type OrderData = { name: string; mode: "retiro" | "delivery"; address: string; notes: string };

export function buildOrderMessage(lines: CartLine[], data: OrderData) {
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const out = [
    "*Pedido RAÍCES — Cocina Boliviana*",
    "",
    ...lines.map((l) => `• ${l.qty} x ${l.product.name} — ${formatCLP(l.product.price * l.qty)}`),
    "",
    `*Total: ${formatCLP(total)}*`,
    "",
    `Nombre: ${data.name}`,
    `Entrega: ${data.mode === "retiro" ? "Retiro en local" : "Delivery"}`,
  ];
  if (data.mode === "delivery") out.push(`Dirección: ${data.address}`);
  if (data.notes.trim()) out.push(`Observaciones: ${data.notes}`);
  return out.join("\n");
}

export const whatsappUrl = (number: string, text: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
