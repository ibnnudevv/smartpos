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
import { EditForm } from "../_forms/edit";
import DeleteForm from "../_forms/delete";
import { toast } from "sonner";

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
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge className="text-xs rounded-full">
          {role.replace("_", " ").toLowerCase()}
        </Badge>
      );
    },
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
    cell: ({ row }) => {
      const user = row.original;

      // Fungsi untuk menghapus user
      const handleDelete = async () => {
        try {
          const response = await fetch(`/api/user?id=${user.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            toast.success("User berhasil dihapus!");
          } else {
            toast.error("Terjadi kesalahan, silahkan coba lagi");
          }
        } catch (error) {
          toast.error("Terjadi kesalahan, silahkan coba lagi");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <EditForm user={user} />
            <DeleteForm
              label="Hapus"
              message="Konfirmasi Hapus"
              description={`Apakah Anda yakin ingin menghapus ${user.nama}?`}
              onConfirm={handleDelete}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
