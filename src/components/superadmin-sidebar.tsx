"use client";

import {
  Car,
  Database,
  Package,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
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

const superAdminNavData = {
  navMain: {
    superadmin: [
      {
        title: "Dashboard",
        url: "/superadmin",
        icon: Database,
      },
      {
        title: "Users",
        url: "/superadmin/users",
        icon: Users,
      },
      {
        title: "Customers",
        url: "/superadmin/customers",
        icon: UserCheck,
      },
      {
        title: "Vehicles",
        url: "/superadmin/vehicles",
        icon: Car,
      },
      {
        title: "Inventory Items",
        url: "/superadmin/inventory-items",
        icon: Package,
      },
    ],
  },
};

export function SuperAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
              <a href="/superadmin">
                <div className="aspect-square w-6 h-6 bg-red-600 rounded-xl text-white flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-base font-semibold">Super Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain userRole="superadmin" items={superAdminNavData.navMain} />
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
