"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Barang } from "@prisma/client";
import { toast } from "sonner";
import { useRefetch } from "@/context/refetch";
import axios from "axios";
import DetailTransaksiDialog from "../_component/detail-transaksi-dialog";

export const columns: ColumnDef<{
  id: string;
  cabang: { id: string; nama: string };
  user: { id: string; nama: string };
  judul: string;
  deskripsi: string;
  createdAt: Date;
  DetailDraftTransaksi: {
    id: string;
    draftTransaksiId: string;
    barangId: string;
    jumlah: number;
    harga: number;
    diskon: number | null;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  } & {
    id: string;
    jumlah: number;
    harga: number;
    diskon: number;
    barang: Barang;
  }[];
}>[] = [
  {
    id: "cabang.nama",
    accessorKey: "cabang.nama",
    header: "Cabang",
    cell: ({ row }) => {
      return (
        <Badge variant={"outline-success"} className="rounded-full">
          {row.original.cabang.nama}
        </Badge>
      );
    },
  },
  {
    id: "user.nama",
    accessorKey: "user.nama",
    header: "Kasir",
  },
  {
    id: "judul",
    accessorKey: "judul",
    header: "Judul",
  },
  {
    id: "deskripsi",
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => {
      return row.original.deskripsi || "-";
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      return (
        new Date(row.original.createdAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      );
    },
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) => {
      const { handleRefetch } = useRefetch();
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const handleOpenDialog = () => {
        setIsDialogOpen(true);
      };

      const handleCloseDialog = () => {
        setIsDialogOpen(false);
      };

      return (
        <div className="flex items-center justify-center space-x-2">
          <Button variant={"outline"} onClick={handleOpenDialog}>
            Detail
          </Button>
          <DetailTransaksiDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            detailDraftTransaksi={row.original.DetailDraftTransaksi}
          />
        </div>
      );
    },
  },
];
