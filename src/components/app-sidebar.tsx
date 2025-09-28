"use client";

import { Cog } from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  CUSTOMERS,
  DASHBOARD,
  JOBS,
  MECHANICS,
  SETTINGS,
  VEHICLES,
} from "@/lib/page-definition";

const data = {
  navMain: {
    superadmin: [DASHBOARD, JOBS, CUSTOMERS, MECHANICS, VEHICLES, SETTINGS],
    admin: [DASHBOARD, JOBS, CUSTOMERS, MECHANICS, VEHICLES, SETTINGS],
    mechanic: [DASHBOARD, JOBS],
  },
};

type UserRole = keyof typeof data.navMain;
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-auto gap-2"
            >
              <a href="/dashboard">
                <div className="aspect-square w-6 h-6 bg-primary rounded-xl text-white  flex items-center justify-center">
                  <Cog className="h-5 w-5" />
                </div>
                <span className="text-base font-semibold">GearShift</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          userRole={(session?.user.role as UserRole) ?? "mechanic"}
          items={data.navMain}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            session?.user ?? {
              name: "",
              email: "",
              image: null,
            }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
