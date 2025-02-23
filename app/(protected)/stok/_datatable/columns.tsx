"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Stok } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<
  Stok & {
    barang: { nama: string };
    cabang: { nama: string };
    isActive: boolean;
  }
>[] = [
  {
    id: "cabang",
    accessorKey: "cabang.nama",
    accessorFn: (row) => row.cabang.nama,
    header: "Cabang",
    cell: ({ row }) => {
      const cabang = row.original.cabang;
      return <Badge variant={"outline-success"}>{cabang.nama}</Badge>;
    },
  },
  {
    id: "barang",
    accessorKey: "barang.nama",
    header: "Nama Barang",
  },
  {
    accessorKey: "jumlah",
    header: "Stok",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.jumlah}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt).toLocaleDateString(
        "id-ID",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
      return date;
    },
  },
];
