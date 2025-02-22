import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableItemComponent = ({
  items,
}: {
  items: {
    id: number;
    kode: string;
    nama: string;
    pid: string;
    qty: number;
    harga: number;
    diskon: string;
    total: number;
  }[];
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Kode Item</TableHead>
            <TableHead>Nama Item</TableHead>
            <TableHead>PID</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Diskon %</TableHead>
            <TableHead>Subtotal+Pajak</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.kode}</TableCell>
              <TableCell>{item.nama}</TableCell>
              <TableCell>{item.pid}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.harga}</TableCell>
              <TableCell>{item.diskon}</TableCell>
              <TableCell>{item.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableItemComponent;
