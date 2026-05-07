import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lp1/components/ui/dialog";
import { Button } from "@/lp1/components/ui/button";
import { Input } from "@/lp1/components/ui/input";
import { Label } from "@/lp1/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/lp1/hooks/use-toast";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });

      onOpenChange(false);
      
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Credenciais inválidas.",
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
            Login
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-foreground">E-mail</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-foreground">Senha</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-primary/20"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest"
            size="lg"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
