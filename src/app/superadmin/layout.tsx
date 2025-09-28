"use client";

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SuperAdminSidebar } from "@/components/superadmin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/");
        return;
      }

      // Check if user is superadmin
      if (session.user.role !== "superadmin") {
        router.push("/dashboard");
        return;
      }
    }
  }, [session, isPending, router]);

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">
          <Loader2Icon className="h-12 w-12 animate-spin" />
        </div>
      </div>
    );
  }

  // Don't render if no session or not superadmin
  if (!session || session.user.role !== "superadmin") {
    return null;
  }

  return (
    <SidebarProvider>
      <SuperAdminSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
