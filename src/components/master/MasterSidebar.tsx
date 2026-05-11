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
    `flex items-center gap-2 hover:bg-white/5 ${a ? "text-[#00ff88]" : ""}`;
  const soonCls =
    "flex items-center gap-2 opacity-50 cursor-not-allowed select-none";
  const SoonBadge = () => (
    <span className="ml-auto text-[9px] uppercase tracking-wider rounded bg-white/10 px-1.5 py-0.5 text-gray-300">
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
          <SidebarGroupLabel>Landing pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className={soonCls}>
                  <FileText className="h-4 w-4" />
                  <span>Minhas LPs</span>
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