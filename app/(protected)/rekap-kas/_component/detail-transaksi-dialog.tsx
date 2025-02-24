// DetailTransaksiDialog.jsx
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JenisKasTransaksi } from "@prisma/client";

const DetailTransaksiDialog = ({
  isOpen,
  onClose,
  transaksi,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaksi: {
    id: string;
    jenis: JenisKasTransaksi;
    jumlah: number;
    keterangan: string;
    createdAt: string;
  }[];
}) => {
  if (!transaksi || transaksi.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-5xl">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <DialogHeader>
            <DialogTitle>Detail Transaksi Kas</DialogTitle>
            <DialogDescription>
              Daftar transaksi kas untuk shift ini.
            </DialogDescription>
          </DialogHeader>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaksi.map((t) => (
                <TableRow
                  key={t.id}
                  className={
                    t.jenis === "KAS_KELUAR" ? "bg-red-50" : "bg-green-50"
                  }
                >
                  <TableCell>{transaksi.indexOf(t) + 1}</TableCell>
                  <TableCell>
                    {t.jenis === "KAS_KELUAR" ? (
                      <Badge variant={"destructive"}>Kas Keluar</Badge>
                    ) : (
                      <Badge variant={"success"}>Kas Masuk</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(t.createdAt).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {t.jumlah.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>{t.keterangan}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DetailTransaksiDialog;
