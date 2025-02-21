"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Barang, KategoriBarang } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { EditForm } from "../_forms/edit";
import DeleteForm from "../_forms/delete";
import { toast } from "sonner";

export const columns: ColumnDef<
  Barang & {
    KategoriBarang: KategoriBarang;
  }
>[] = [
  {
    accessorKey: "kode",
    header: "Kode Barang",
  },
  {
    accessorKey: "nama",
    header: "Nama Barang",
  },
  {
    accessorKey: "KategoriBarang.nama",
    header: "Kategori",
    cell: ({ row }) => {
      return (
        <Badge variant={"default"} className="text-xs font-normal">
          {row.original.KategoriBarang.nama}
        </Badge>
      );
    },
  },
  {
    accessorKey: "harga",
    header: "Harga",
    cell: ({ row }) => {
      let harga = row.original.harga;
      let diskon = row.original.diskon || 0;
      let hargaDiskon = harga - (harga * diskon) / 100;

      // format harga
      const formattedHarga = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(harga);

      const formattedHargaDiskon = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(hargaDiskon);

      return diskon > 0 ? (
        <div className="text-xs">
          <span className="block text-gray-400 line-through">
            {formattedHarga}
          </span>
          <span className="block text-green-800 font-medium">
            {formattedHargaDiskon}
          </span>
        </div>
      ) : (
        <span className="font-medium text-xs">{formattedHarga}</span>
      );
    },
  },
  {
    accessorKey: "diskon",
    header: "Diskon",
    cell: ({ row }) => {
      const diskon = row.original.diskon;
      return diskon == 0 ? "-" : diskon + "%";
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
      const barang = row.original;

      const handleDelete = async () => {
        try {
          const response = await fetch(`/api/barang?id=${barang.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            toast.success("Barang berhasil dihapus!");
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
            <EditForm barang={barang} />
            <DeleteForm
              label="Hapus"
              message="Konfirmasi Hapus"
              description={`Apakah Anda yakin ingin menghapus ${barang.nama}?`}
              onConfirm={handleDelete}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
