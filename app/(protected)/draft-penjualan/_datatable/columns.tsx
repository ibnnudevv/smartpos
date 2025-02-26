"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import DetailTransaksiDialog from "../_component/detail-transaksi-dialog";
import { Button } from "@/components/ui/button";
import { JenisKasTransaksi } from "@prisma/client";
import { toast } from "sonner";
import { useRefetch } from "@/context/refetch";
import axios from "axios";

export const columns: ColumnDef<{
  id: string;
  cabang: { id: string; nama: string };
  user: { id: string; nama: string };
  mulaiShift: string;
  tutupShift: string | null;
  saldoAwal: number;
  saldoAkhir: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  KasTransaksi: {
    id: string;
    kasirShiftId: string;
    jenis: JenisKasTransaksi;
    jumlah: number;
    keterangan: string;
    createdAt: string;
    updatedAt: string;
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
    accessorKey: "mulaiShift",
    header: "Mulai Shift",
    cell: ({ row }) => {
      // date format: dd/mm/yyyy hh:mm
      const date = new Date(row.original.mulaiShift).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return date === "Invalid Date" ? row.original.mulaiShift : date + " WIB";
    },
  },
  {
    accessorKey: "tutupShift",
    header: "Tutup Shift",
    cell: ({ row }) => {
      if (row.original.tutupShift === null) {
        return "-";
      }
      // date format: dd/mm/yyyy hh:mm
      const date = new Date(row.original.tutupShift).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return date === "Invalid Date" ? row.original.tutupShift : date + " WIB";
    },
  },
  {
    accessorKey: "saldoAwal",
    header: "Saldo Awal",
    cell: ({ row }) => {
      return row.original.saldoAwal.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
  },
  {
    accessorKey: "saldoAkhir",
    header: "Saldo Akhir",
    cell: ({ row }) => {
      if (row.original.saldoAkhir === null) {
        return "-";
      }
      return row.original.saldoAkhir.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.status === "AKTIF" ? "success" : "error"}
          className="text-xs rounded-full"
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "KasTransaksi",
    header: "Jumlah Transaksi",
    cell: ({ row }) => {
      return row.original.KasTransaksi.length;
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

      const handleCloseShift = async () => {
        const confirm = window.confirm(
          "Apakah anda yakin ingin menutup shift ini?"
        );
        if (!confirm) return;
        try {
          await axios.post("/api/rekap-kas", {
            cabangId: row.original.cabang.id,
            userId: row.original.user.id,
            id: row.original.id,
          });
          handleRefetch("fetch-rekap-kas");
          toast.success("Shift berhasil ditutup");
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Internal Server Error"
          );
        }
      };

      return (
        <div className="flex items-center justify-center space-x-2">
          {row.original.tutupShift === null && (
            <Button variant={"destructive"} onClick={handleCloseShift}>
              Tutup Shift
            </Button>
          )}
          <Button variant={"outline"} onClick={handleOpenDialog}>
            Detail
          </Button>
          <DetailTransaksiDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            transaksi={row.original.KasTransaksi}
          />
        </div>
      );
    },
  },
];
