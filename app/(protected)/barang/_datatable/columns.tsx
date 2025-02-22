"use client";
import { useBarcode } from "next-barcode";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useQRCode } from "next-qrcode";

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
import { useRefetch } from "@/context/refetch";

export const columns: ColumnDef<
  Barang & {
    KategoriBarang: KategoriBarang;
  }
>[] = [
  {
    header: "No",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "kode",
    header: "Kode Barang",
    cell: ({ row }) => {
      const { inputRef } = useBarcode({
        // value: `http://192.168.0.100:3000/barang?kode_barang=${row.original.kode}`,
        value: row.original.kode,
        options: {
          displayValue: true,
          flat: true,
          fontSize: 14,
          background: "transparent",
        },
      });
      return <img ref={inputRef} className="w-24 h-10" />;
      // const { Canvas } = useQRCode();
      // return (
      //   <Canvas
      //     text={`http://192.168.0.100:3000/api/barang?kode_barang=${row.original.kode}`}
      //     options={{
      //       errorCorrectionLevel: "M",
      //       margin: 3,
      //       scale: 4,
      //       width: 200,
      //       color: {
      //         dark: "#010599FF",
      //         light: "#FFBF60FF",
      //       },
      //     }}
      //   />
      // );
    },
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
        <Badge
          variant={"outline-secondary"}
          className="font-normal rounded-full"
        >
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
        <div>
          <span className="block text-xs text-gray-400 line-through">
            {formattedHarga}
          </span>
          <span className="block text-black font-medium">
            {formattedHargaDiskon}
          </span>
        </div>
      ) : (
        <span className="font-medium">{formattedHarga}</span>
      );
    },
  },
  {
    accessorKey: "diskon",
    header: "Diskon",
    cell: ({ row }) => {
      const diskon = row.original.diskon;
      return diskon == 0 ? (
        "-"
      ) : (
        <div className="font-medium rounded-full border border-gray-200 w-9 h-9 text-center text-xs flex items-center justify-center">
          {diskon}%
        </div>
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
    header: "",
    cell: ({ row }) => {
      const { handleRefetch } = useRefetch();
      const barang = row.original;

      const handleDelete = async () => {
        try {
          const response = await fetch(`/api/barang?id=${barang.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            toast.success("Barang berhasil dihapus!");
            handleRefetch("fetch-barang");
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
