import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { browserSupportsWebAuthn, startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const DISMISS_KEY = "rla:passkey-dismissed";

const PasskeySetup = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!browserSupportsWebAuthn()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("webauthn_credentials")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);
      if (!data || data.length === 0) setShow(true);
    })();
  }, []);

  const enable = async () => {
    setLoading(true);
    try {
      const { data: optsData, error: optsErr } = await supabase.functions.invoke("webauthn-register-options", {
        body: {},
      });
      if (optsErr) throw optsErr;
      const attResp = await startRegistration({ optionsJSON: optsData.options });
      const deviceName = navigator.userAgent.includes("iPhone")
        ? "iPhone"
        : navigator.userAgent.includes("Android")
        ? "Android"
        : navigator.userAgent.includes("Mac")
        ? "Mac"
        : "Dispositivo";
      const { error: vErr } = await supabase.functions.invoke("webauthn-register-verify", {
        body: { response: attResp, deviceName },
      });
      if (vErr) throw vErr;
      toast.success("Biometria ativada! Use no próximo login.");
      setShow(false);
    } catch (e: any) {
      const msg = e?.message || "";
      if (/NotAllowedError|cancel/i.test(msg)) toast.error("Cancelado");
      else toast.error("Não foi possível ativar a biometria");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="mx-4 md:mx-12 my-4 rounded-xl border border-[#00ff88]/30 bg-gradient-to-r from-[#00ff88]/10 to-transparent p-4 flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-[#00ff88]/15 flex items-center justify-center shrink-0">
        <Fingerprint className="h-6 w-6 text-[#00ff88]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm md:text-base" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}>
          Ative o login por biometria
        </p>
        <p className="text-xs md:text-sm text-gray-400">
          Entre com Face ID ou digital sem precisar digitar a senha.
        </p>
      </div>
      <button
        onClick={enable}
        disabled={loading}
        className="h-10 px-4 rounded-md bg-[#00ff88] text-black text-sm font-bold uppercase whitespace-nowrap disabled:opacity-60"
        style={{ fontFamily: "'Bebas Neue', cursive" }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ativar"}
      </button>
      <button onClick={dismiss} className="text-gray-500 hover:text-white" aria-label="Dispensar">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PasskeySetup;