import { useEffect, useState } from "react";
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
  Users,
  Activity,
  FileText,
  Settings,
  CreditCard,
  Database,
  Layers,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Area {
  id: string;
  slug: string;
  name: string;
  product: string;
}

export function MasterSidebar() {
  const { pathname, search } = useLocation();
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    supabase
      .from("member_areas")
      .select("id,slug,name,product")
      .order("name")
      .then(({ data }) => setAreas((data as Area[]) || []));
  }, [pathname]);

  const isActive = (path: string) => pathname + search === path || pathname === path;
  const linkCls = ({ isActive: a }: { isActive: boolean }) =>
    `flex items-center gap-2 hover:bg-white/5 ${a ? "text-[#00ff88]" : ""}`;

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10">
      <SidebarContent className="bg-[#0a0a0a] text-gray-200">
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <NavLink to="/" className={linkCls} end>
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
              {areas.map((a) => {
                const adminPath = `/admin?product=${encodeURIComponent(a.product)}`;
                return (
                  <SidebarMenuItem key={a.id}>
                    <SidebarMenuButton asChild isActive={isActive(adminPath)}>
                      <NavLink to={adminPath} className={linkCls}>
                        <ChevronDot />
                        <span className="truncate">{a.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Trackeamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/trackeamento"}>
                  <NavLink to="/admin/trackeamento" className={linkCls}>
                    <Activity className="h-4 w-4" />
                    <span>Pixels</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/capi-log"}>
                  <NavLink to="/admin/capi-log" className={linkCls}>
                    <Database className="h-4 w-4" />
                    <span>CAPI Log</span>
                  </NavLink>
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
                <SidebarMenuButton asChild isActive={pathname === "/landing-pages"}>
                  <NavLink to="/landing-pages" className={linkCls}>
                    <FileText className="h-4 w-4" />
                    <span>Minhas LPs</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Outros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/usuarios"}>
                  <NavLink to="/admin/usuarios" className={linkCls}>
                    <Users className="h-4 w-4" />
                    <span>Usuários</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/credenciais"}>
                  <NavLink to="/admin/credenciais" className={linkCls}>
                    <CreditCard className="h-4 w-4" />
                    <span>Pagamentos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/configuracoes"}>
                  <NavLink to="/admin/configuracoes" className={linkCls}>
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/membros" className={linkCls}>
                    <ExternalLink className="h-4 w-4" />
                    <span>Ir para a área de membros</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function ChevronDot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff2d78]" />;
}