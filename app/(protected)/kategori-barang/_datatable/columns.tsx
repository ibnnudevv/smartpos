"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KategoriBarang } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { EditForm } from "../_forms/edit";
import DeleteForm from "../_forms/delete";
import { toast } from "sonner";
import { useRefetch } from "@/context/refetch";

export const columns: ColumnDef<KategoriBarang>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
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
    header: "",
    cell: ({ row }) => {
      const { handleRefetch } = useRefetch();
      const kategoriBarang = row.original;

      // Fungsi untuk menghapus user
      const handleDelete = async () => {
        try {
          const response = await fetch(
            `/api/kategori-barang?id=${kategoriBarang.id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            toast.success("Kategori barang berhasil dihapus!");
            handleRefetch("fetch-kategori-barang");
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
            <EditForm kategoriBarang={kategoriBarang} />
            <DeleteForm
              label="Hapus"
              message="Konfirmasi Hapus"
              description={`Apakah Anda yakin ingin menghapus ${kategoriBarang.nama}?`}
              onConfirm={handleDelete}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
