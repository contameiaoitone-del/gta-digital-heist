import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { browserSupportsWebAuthn, startRegistration } from "@simplewebauthn/browser";
import { X, KeyRound, Fingerprint, Loader2, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  email: string;
  progressPct: number;
  completedLessons: number;
  totalLessons: number;
}

interface Cred { id: string; device_name: string | null; created_at: string; }

const ProfileDialog = ({ open, onClose, email, progressPct, completedLessons, totalLessons }: Props) => {
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [creds, setCreds] = useState<Cred[]>([]);
  const [bioBusy, setBioBusy] = useState(false);
  const [supportsBio, setSupportsBio] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSupportsBio(browserSupportsWebAuthn());
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return;
      const { data } = await supabase.from("webauthn_credentials").select("id, device_name, created_at").eq("user_id", sess.session.user.id);
      setCreds((data as Cred[]) || []);
    })();
  }, [open]);

  if (!open) return null;

  const savePassword = async () => {
    if (newPw.length < 6) { toast.error("Senha mínima de 6 caracteres"); return; }
    if (newPw !== newPw2) { toast.error("As senhas não conferem"); return; }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSavingPw(false);
    if (error) toast.error(error.message);
    else { toast.success("Senha atualizada"); setPwOpen(false); setNewPw(""); setNewPw2(""); }
  };

  const enrollBio = async () => {
    setBioBusy(true);
    try {
      const { data: optsData, error: optsErr } = await supabase.functions.invoke("webauthn-register-options", { body: {} });
      if (optsErr) throw optsErr;
      const attResp = await startRegistration({ optionsJSON: optsData.options });
      const ua = navigator.userAgent;
      const deviceName = ua.includes("iPhone") ? "iPhone" : ua.includes("Android") ? "Android" : ua.includes("Mac") ? "Mac" : "Dispositivo";
      const { error: vErr } = await supabase.functions.invoke("webauthn-register-verify", { body: { response: attResp, deviceName } });
      if (vErr) throw vErr;
      toast.success("Biometria ativada!");
      const { data: sess } = await supabase.auth.getSession();
      if (sess.session) {
        const { data } = await supabase.from("webauthn_credentials").select("id, device_name, created_at").eq("user_id", sess.session.user.id);
        setCreds((data as Cred[]) || []);
      }
    } catch (e: any) {
      const msg = e?.message || "";
      if (/NotAllowedError|cancel/i.test(msg)) toast.error("Cadastro cancelado");
      else toast.error("Não foi possível ativar a biometria");
    } finally { setBioBusy(false); }
  };

  const removeCred = async (id: string) => {
    if (!confirm("Desativar esta biometria?")) return;
    const { error } = await supabase.from("webauthn_credentials").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Biometria desativada"); setCreds((c) => c.filter((x) => x.id !== id)); }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>Meu perfil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
          <Mail className="h-4 w-4 text-gray-500" /> <span className="break-all">{email}</span>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Progresso geral</span>
            <span>{completedLessons}/{totalLessons} aulas · {progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-[#00ff88] transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="space-y-3">
          {!pwOpen ? (
            <button onClick={() => setPwOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded border border-white/15 hover:border-[#00ff88] text-sm">
              <KeyRound className="h-4 w-4" /> Alterar senha
            </button>
          ) : (
            <div className="border border-white/15 rounded p-3 space-y-2">
              <input type="password" autoFocus value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Nova senha" className="w-full h-9 rounded bg-black/40 border border-white/15 px-2 text-white text-sm focus:outline-none focus:border-[#00ff88]" />
              <input type="password" value={newPw2} onChange={(e) => setNewPw2(e.target.value)} placeholder="Confirmar nova senha" className="w-full h-9 rounded bg-black/40 border border-white/15 px-2 text-white text-sm focus:outline-none focus:border-[#00ff88]" />
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setPwOpen(false); setNewPw(""); setNewPw2(""); }} className="px-3 py-1.5 text-xs text-gray-400">Cancelar</button>
                <button onClick={savePassword} disabled={savingPw} className="px-3 py-1.5 bg-[#00ff88] text-black font-bold rounded text-xs flex items-center gap-1">
                  {savingPw && <Loader2 className="h-3 w-3 animate-spin" />} Salvar
                </button>
              </div>
            </div>
          )}

          <div className="border border-white/15 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm"><Fingerprint className="h-4 w-4 text-[#00ff88]" /> Biometria</div>
              {supportsBio && (
                <button onClick={enrollBio} disabled={bioBusy} className="px-3 py-1 rounded bg-[#00ff88] text-black font-bold text-xs">
                  {bioBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : creds.length > 0 ? "Adicionar" : "Ativar"}
                </button>
              )}
            </div>
            {!supportsBio ? (
              <p className="text-xs text-gray-500">Este dispositivo não suporta biometria.</p>
            ) : creds.length === 0 ? (
              <p className="text-xs text-gray-500">Nenhuma biometria cadastrada.</p>
            ) : (
              <ul className="space-y-1">
                {creds.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-xs text-gray-300">
                    <span>{c.device_name || "Dispositivo"} · {new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
                    <button onClick={() => removeCred(c.id)} className="text-gray-500 hover:text-[#ff2d78]"><Trash2 className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDialog;