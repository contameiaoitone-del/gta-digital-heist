import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolves the route param `:product` (which can be either a slug like "treinamento"
 * or an area UUID) into the canonical product slug, the area UUID and the area name.
 * Existing admin/membros pages can keep using `productFilter` (slug) for queries while
 * URLs migrate to UUID-based routing.
 */
export function useResolvedArea() {
  const { product: param } = useParams<{ product?: string }>();
  const [state, setState] = useState<{
    loading: boolean;
    product: string;
    areaId: string | null;
    areaName: string | null;
    routeParam: string;
  }>({ loading: true, product: param || "treinamento", areaId: null, areaName: null, routeParam: param || "treinamento" });

  useEffect(() => {
    if (!param) {
      setState({ loading: false, product: "treinamento", areaId: null, areaName: null, routeParam: "treinamento" });
      return;
    }
    let cancelled = false;
    (async () => {
      const isUuid = UUID_RE.test(param);
      const { data } = await supabase
        .from("member_areas")
        .select("id, product, name")
        .eq(isUuid ? "id" : "product", param)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setState({
          loading: false,
          product: data.product,
          areaId: data.id,
          areaName: data.name,
          routeParam: param,
        });
      } else {
        setState({ loading: false, product: param, areaId: null, areaName: null, routeParam: param });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [param]);

  return state;
}