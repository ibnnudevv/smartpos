"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cabang } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { EditForm } from "../_forms/edit";
import DeleteForm from "../_forms/delete";
import { toast } from "sonner";

export const columns: ColumnDef<Cabang>[] = [
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
      const cabang = row.original;

      const handleDelete = async () => {
        try {
          const response = await fetch(`/api/cabang?id=${cabang.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            toast.success("Cabang berhasil dihapus!");
          } else {
            toast.error("Terjadi kesalahan, silahkan coba lagi");
          }
        } catch (error) {
          toast.error("Terjadi kesalahan, silahkan coba lagi");
        }
      };

      const handleActivate = async () => {
        try {
          const response = await fetch(
            `/api/cabang?id=${cabang.id}&status=true`,
            {
              method: "PATCH",
            }
          );

          if (response.ok) {
            toast.success("Cabang berhasil diaktifkan!");
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
            <EditForm cabang={cabang} />
            {cabang.isActive ? (
              <DeleteForm
                label="Hapus"
                message="Konfirmasi Hapus"
                description={`Apakah Anda yakin ingin menghapus ${cabang.nama}?`}
                onConfirm={handleDelete}
              />
            ) : (
              <DeleteForm
                label="Aktifkan"
                message="Konfirmasi Aktifkan"
                description={`Apakah Anda yakin ingin mengaktifkan ${cabang.nama}?`}
                onConfirm={handleActivate}
                buttonLabel="Aktifkan"
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
