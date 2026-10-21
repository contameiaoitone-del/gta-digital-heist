import { useEffect, useState } from "react";
import { loadCheckoutGeo, type CheckoutGeo } from "@/lib/checkoutGeo";

/** null enquanto carrega (o modal espera, no máximo ~3,5 s); depois o país/oferta decididos pelo servidor. */
export function useCheckoutGeo(product: string): CheckoutGeo | null {
  const [geo, setGeo] = useState<CheckoutGeo | null>(null);
  useEffect(() => {
    let alive = true;
    loadCheckoutGeo(product).then((g) => { if (alive) setGeo(g); });
    return () => { alive = false; };
  }, [product]);
  return geo;
}
