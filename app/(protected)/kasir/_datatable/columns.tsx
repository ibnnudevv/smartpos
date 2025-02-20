"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cabang, User } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<
  User & {
    cabang: Cabang;
  }
>[] = [
  {
    id: "cabang",
    header: "Cabang",
    accessorFn: (row) => row.cabang?.nama,
    cell: ({ row }) => {
      const cabang = row.original.cabang;
      return <span>{cabang?.nama}</span>;
    },
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant={"info"} className="text-xs rounded-full">
          {role.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge
          variant={isActive ? "success" : "error"}
          className="text-xs rounded-full"
        >
          {isActive ? "Aktif" : "Tidak Aktif"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Hapus</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
