import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Database,
  Layers,
  Clock,
} from "lucide-react";

export function MasterSidebar() {
  const { pathname } = useLocation();
  const linkCls = ({ isActive: a }: { isActive: boolean }) =>
    `flex items-center gap-2 text-gray-100 hover:bg-white/5 hover:text-[#d95e10] ${a ? "text-[#d95e10]" : ""}`;
  const soonCls =
    "flex items-center gap-2 text-gray-200 opacity-70 hover:text-[#d95e10] cursor-not-allowed select-none";
  const SoonBadge = () => (
    <span className="ml-auto text-[9px] uppercase tracking-wider rounded bg-[#d95e10]/15 px-1.5 py-0.5 text-[#d95e10]">
      em breve
    </span>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10">
      <SidebarContent className="bg-[#0a0a0a] text-gray-200">
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/home"}>
                  <NavLink to="/home" className={linkCls} end>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Início</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Áreas de membro</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/areas"}>
                  <NavLink to="/areas" className={linkCls}>
                    <Layers className="h-4 w-4" />
                    <span>Gerenciar áreas</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Trackeamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className={soonCls}>
                  <Activity className="h-4 w-4" />
                  <span>Pixels</span>
                  <SoonBadge />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className={soonCls}>
                  <Database className="h-4 w-4" />
                  <span>CAPI Log</span>
                  <SoonBadge />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Extras</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className={soonCls}>
                  <FileText className="h-4 w-4" />
                  <span>Página de Vendas</span>
                  <SoonBadge />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className={soonCls}>
                  <Clock className="h-4 w-4" />
                  <span>Quiz Interativo</span>
                  <SoonBadge />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}