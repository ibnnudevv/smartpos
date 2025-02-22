"use client";

import * as React from "react";
import {
  Activity,
  Archive,
  Book,
  CreditCard,
  FolderArchive,
  FolderOpen,
  GalleryVerticalEnd,
  GitBranch,
  Monitor,
  NotebookText,
  Sparkles,
  SquareTerminal,
  Users,
  WalletCards,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { isCancel } from "axios";

const data = {
  navMain: [
    {
      title: "Point of Sale",
      url: "/",
      icon: Sparkles,
      isActive: true,
      items: [
        {
          title: "Kasir",
          icon: Monitor,
          url: "/kasir",
        },
        {
          title: "Rekap Kas",
          icon: GalleryVerticalEnd,
          url: "/rekap-kas",
        },
        {
          title: "Draft Penjualan",
          icon: Archive,
          url: "/draft-penjualan",
        },
      ],
    },
    {
      title: "Master Data",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Karyawan",
          icon: Users,
          url: "/karyawan",
        },
        {
          title: "Barang",
          icon: FolderOpen,
          url: "/barang",
        },
        {
          title: "Kategori Barang",
          icon: FolderOpen,
          url: "/kategori-barang",
        },
        {
          title: "Stok",
          icon: FolderArchive,
          url: "/stok",
        },
        {
          title: "Cabang",
          icon: GitBranch,
          url: "/cabang",
        },
      ],
    },
    {
      title: "Transaksi",
      url: "#",
      icon: WalletCards,
      items: [
        {
          title: "Penjualan",
          icon: CreditCard,
          url: "#",
        },
        {
          title: "Pembelian",
          icon: CreditCard,
          url: "#",
        },
        {
          title: "Pengeluaran",
          icon: CreditCard,
          url: "#",
        },
      ],
    },
    {
      title: "Laporan",
      url: "#",
      icon: NotebookText,
      items: [
        {
          title: "Penjualan",
          icon: Book,
          url: "#",
        },
        {
          title: "Pembelian",
          icon: Book,
          url: "#",
        },
        {
          title: "Pengeluaran",
          icon: Book,
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isLoaded, isSignedIn, user } = useUser();

  React.useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) window.location.href = "/sign-in";
  }, [isLoaded, isSignedIn]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="gap-0">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            (user as {
              fullName: string;
            }) ?? {
              fullName: "Guest",
            }
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
