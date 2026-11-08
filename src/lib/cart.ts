import { useEffect, useState } from "react";

const KEY = "raices-cart-v1";
export type CartState = Record<string, number>;

export function useCart() {
  const [cart, setCart] = useState<CartState>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(cart));
  }, [cart, ready]);

  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const n = { ...c };
      if (qty <= 0) delete n[id];
      else n[id] = Math.min(qty, 99);
      return n;
    });

  return {
    cart,
    add: (id: string) => setQty(id, (cart[id] ?? 0) + 1),
    setQty,
    clear: () => setCart({}),
  };
}
