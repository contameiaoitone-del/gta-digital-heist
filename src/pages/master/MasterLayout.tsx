import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MasterSidebar } from "@/components/master/MasterSidebar";
import { useSignOut } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function MasterLayout({ children }: { children: ReactNode }) {
  const signOut = useSignOut();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#080808] text-white font-body">
        <MasterSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b border-white/10 px-3 bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-gray-300" />
              <span className="font-gta text-lg tracking-wide">Master Panel</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}