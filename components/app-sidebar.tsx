"use client"

import * as React from "react"
import {
  Book,
  CreditCard,
  FolderArchive,
  NotebookText,
  SquareTerminal,
  WalletCards
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter, SidebarRail
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Master Data",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Barang",
          icon: FolderArchive,
          url: "#",
        },
        {
          title: "Stok",
          icon: FolderArchive,
          url: "#",
        },
        {
          title: "Cabang",
          icon: FolderArchive,
          url: "#",
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
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
