import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { browserSupportsWebAuthn, startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DISMISS_KEY = "passkey_setup_dismissed_at";
const DISMISS_DAYS = 7;

const PasskeySetup = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!browserSupportsWebAuthn()) return;
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed) {
        const ageMs = Date.now() - Number(dismissed);
        if (ageMs < DISMISS_DAYS * 86400000) return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const { count } = await supabase
        .from("webauthn_credentials")
        .select("id", { count: "exact", head: true })
        .eq("user_id", data.session.user.id);
      if (alive && (count ?? 0) === 0) setShow(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  const enroll = async () => {
    setLoading(true);
    try {
      const { data: optsData, error: optsErr } = await supabase.functions.invoke("webauthn-register-options", {
        body: {},
      });
      if (optsErr) throw optsErr;
      const attResp = await startRegistration({ optionsJSON: optsData.options });
      const ua = navigator.userAgent;
      const deviceName = ua.includes("iPhone")
        ? "iPhone"
        : ua.includes("Android")
        ? "Android"
        : ua.includes("Mac")
        ? "Mac"
        : "Dispositivo";
      const { error: vErr } = await supabase.functions.invoke("webauthn-register-verify", {
        body: { response: attResp, deviceName },
      });
      if (vErr) throw vErr;
      toast.success("Biometria cadastrada!");
      setShow(false);
    } catch (e: any) {
      const msg = e?.message || "";
      if (/NotAllowedError|cancel/i.test(msg)) toast.error("Cadastro cancelado");
      else toast.error("Não foi possível cadastrar a biometria");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-12 mt-4">
      <div className="relative bg-gradient-to-r from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 rounded-xl p-4 md:p-5 flex items-center gap-4">
        <button
          onClick={dismiss}
          aria-label="Dispensar"
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="h-12 w-12 rounded-full bg-[#00ff88]/15 flex items-center justify-center shrink-0">
          <Fingerprint className="h-6 w-6 text-[#00ff88]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Ative o login por biometria
          </h3>
          <p className="text-sm text-gray-300">
            Entre com Face ID ou digital nas próximas vezes — sem precisar digitar senha.
          </p>
        </div>
        <button
          onClick={enroll}
          disabled={loading}
          className="shrink-0 h-10 px-4 rounded-md font-bold uppercase tracking-wide text-sm disabled:opacity-60"
          style={{ backgroundColor: "#00ff88", color: "#000", fontFamily: "'Bebas Neue', cursive" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ativar agora"}
        </button>
      </div>
    </div>
  );
};

export default PasskeySetup;