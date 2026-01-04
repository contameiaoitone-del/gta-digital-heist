import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Instagram, Send, Clock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  instagram: z
    .string()
    .min(1, "@ do Instagram é obrigatório")
    .max(50)
    .regex(/^@?[\w.]+$/, "Instagram inválido"),
  email: z.string().email("Email inválido").max(255),
});

type FormData = z.infer<typeof formSchema>;

const RPCloseSuccess = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      instagram: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Form submitted:", data);
    
    toast({
      title: "Dados enviados com sucesso!",
      description: "Seu acesso será liberado em breve.",
    });
    
    setIsSubmitted(true);
    setIsLoading(false);
  };

  const handleInstagramDM = () => {
    window.open("https://ig.me/m/caiodalcin", "_blank");
  };

  const steps = [
    {
      icon: Send,
      title: "Preencha o formulário",
      description: "Informe seu @ do Instagram para liberarmos o acesso",
    },
    {
      icon: UserPlus,
      title: "Siga @caiodalcin",
      description: "Siga o perfil para receber o convite do Close Friends",
    },
    {
      icon: Clock,
      title: "Aguarde a liberação",
      description: "Seu acesso será liberado em até 24 horas",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D400A6]/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D400A6] blur-xl opacity-50 rounded-full" />
              <div className="relative bg-[#D400A6]/20 p-4 rounded-full border border-[#D400A6]/50">
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-[#D400A6]" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            Compra Confirmada!
          </h1>
          <p className="text-lg md:text-xl text-gray-400 animate-fade-in">
            Agora só falta liberar seu acesso ao Close Friends
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="bg-zinc-900/50 border-zinc-800 hover:border-[#D400A6]/30 transition-colors"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#D400A6]/10 p-3 rounded-full">
                      <step.icon className="w-6 h-6 text-[#D400A6]" />
                    </div>
                  </div>
                  <div className="text-[#D400A6] text-sm font-medium mb-2">
                    Passo {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-zinc-900/80 border-zinc-800">
            <CardHeader className="text-center">
              <CardTitle className="text-xl md:text-2xl">
                {isSubmitted ? "Dados Recebidos!" : "Preencha seus dados"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-500/20 p-3 rounded-full">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Perfeito! Seus dados foram recebidos. Agora é só aguardar a
                    liberação do seu acesso ao Close Friends.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Quer agilizar? Mande uma mensagem no Instagram:
                  </p>
                  <Button
                    onClick={handleInstagramDM}
                    className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Mandar mensagem no Instagram
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu nome"
                              className="bg-zinc-800 border-zinc-700 focus:border-[#D400A6]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>@ do Instagram</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="@seuinstagram"
                              className="bg-zinc-800 border-zinc-700 focus:border-[#D400A6]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              className="bg-zinc-800 border-zinc-700 focus:border-[#D400A6]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#D400A6] hover:bg-[#D400A6]/90 text-white mt-6"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar dados
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Instagram CTA Section */}
      {!isSubmitted && (
        <section className="py-8 px-4">
          <div className="max-w-md mx-auto text-center">
            <p className="text-gray-400 mb-4">
              Já preencheu o formulário e quer agilizar?
            </p>
            <Button
              onClick={handleInstagramDM}
              variant="outline"
              className="border-[#D400A6]/50 text-[#D400A6] hover:bg-[#D400A6]/10"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Mandar mensagem no Instagram
            </Button>
          </div>
        </section>
      )}

      {/* Support Section */}
      <section className="py-12 px-4 border-t border-zinc-800">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-gray-500">
            Dúvidas? Entre em contato pelo Instagram{" "}
            <a
              href="https://instagram.com/caiodalcin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D400A6] hover:underline"
            >
              @caiodalcin
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default RPCloseSuccess;
