import type { Metadata } from "next";
import "@/app/globals.css";
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import { LayoutDashboardIcon, NotebookTabs, User2 } from "lucide-react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log(`sesion: ${session}`);
  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="flex">
      <Sidebar session={session as Session}>
        <SidebarItem
          icon={<LayoutDashboardIcon size={30} />}
          text="Dashboard"
          href="/console/dashboard"
        />
        <SidebarItem
          icon={<User2 size={30} />}
          text="Clients"
          href="/console/clients"
        />
        <SidebarItem
          icon={<NotebookTabs size={30} />}
          text="Invoices"
          href="/console/invoices"
        />
      </Sidebar>
      {children}
    </main>
  );
}
