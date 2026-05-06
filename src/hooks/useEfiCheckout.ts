import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CustomerPayload {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface PixResponse {
  order_id: string;
  txid: string;
  copia_cola: string;
  qrcode_image: string;
  expires_in: number;
}

export interface CardPayload extends CustomerPayload {
  payment_token: string;
  installments: number;
  birth: string; // YYYY-MM-DD
}

export interface CardResponse {
  order_id: string;
  charge_id: string;
  status: "paid" | "pending" | "failed" | string;
}

export function useEfiCheckout() {
  const [loading, setLoading] = useState(false);

  const createPix = useCallback(async (payload: CustomerPayload): Promise<PixResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("efi-create-pix", { body: payload });
      if (error) throw new Error(error.message);
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      return data as PixResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async (orderId: string): Promise<{ status: string }> => {
    const { data, error } = await supabase.functions.invoke("efi-check-status", {
      body: { order_id: orderId },
    });
    if (error) throw new Error(error.message);
    return data as { status: string };
  }, []);

  const createCard = useCallback(async (payload: CardPayload): Promise<CardResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("efi-create-card", { body: payload });
      if (error) throw new Error(error.message);
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      return data as CardResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, createPix, checkStatus, createCard };
}
