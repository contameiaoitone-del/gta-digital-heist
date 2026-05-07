import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lp1/components/ui/dialog";
import { Button } from "@/lp1/components/ui/button";
import { Input } from "@/lp1/components/ui/input";
import { Label } from "@/lp1/components/ui/label";
import { Checkbox } from "@/lp1/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/lp1/hooks/use-toast";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignupDialog = ({ open, onOpenChange }: SignupDialogProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmed) {
      toast({
        title: "Compromisso necessário",
        description: "Você precisa confirmar seu compromisso para continuar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles' as any)
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            whatsapp: whatsapp,
          });

        if (profileError) throw profileError;

        toast({
          title: "Bem-vindo à Confraria!",
          description: "Sua conta foi criada com sucesso.",
        });

        onOpenChange(false);
        
        // Reset form
        setFullName("");
        setEmail("");
        setWhatsapp("");
        setPassword("");
        setConfirmed(false);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-2 border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary uppercase tracking-wider text-center">
            Entrar na Confraria
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSignup} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nome</Label>
            <Input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-input border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-foreground">WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              placeholder="(00) 00000-0000"
              className="bg-input border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-input border-primary/20"
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="commitment"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              className="border-primary"
            />
            <label
              htmlFor="commitment"
              className="text-sm text-foreground/80 leading-tight cursor-pointer"
            >
              Confirmo que estou assumindo um compromisso de fazer acontecer.
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold uppercase tracking-widest"
            size="lg"
          >
            {loading ? "Criando..." : "Criar minha conta"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
