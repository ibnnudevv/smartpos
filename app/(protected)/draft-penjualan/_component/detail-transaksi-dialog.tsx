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
import { Barang, DetailDraftTransaksi } from "@prisma/client";

const DetailTransaksiDialog = ({
  isOpen,
  onClose,
  detailDraftTransaksi,
}: {
  isOpen: boolean;
  onClose: () => void;
  detailDraftTransaksi: DetailDraftTransaksi &
    {
      id: string;
      jumlah: number;
      harga: number;
      diskon: number;
      barang: Barang;
    }[];
}) => {
  if (!detailDraftTransaksi || detailDraftTransaksi.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-5xl">
        <ScrollArea className="h-96">
          <DialogHeader>
            <DialogTitle>Detail Draft Transaksi</DialogTitle>
            <DialogDescription>
              Daftar transaksi yang terdapat pada draft transaksi ini
            </DialogDescription>
          </DialogHeader>
          <Table className="mt-4">
            <TableHeader>
              <TableRow className="font-medium">
                <TableHead>No</TableHead>
                <TableHead>Barang</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Diskon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailDraftTransaksi.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.barang?.nama}</TableCell>
                  <TableCell>{item.jumlah}</TableCell>
                  <TableCell className="text-right">
                    {item.harga.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.diskon
                      ? item.diskon.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })
                      : "-"}
                  </TableCell>
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
