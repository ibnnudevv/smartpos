import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";

const TableItemComponent = ({
  items,
  handleAddQty,
  handleSubtractQty,
  handleRemoveItem,
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
  handleAddQty: (id: string) => void;
  handleSubtractQty: (id: string) => void;
  handleRemoveItem: (id: string) => void;
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
            <TableHead>Subtotal</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 &&
            items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.kode}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.pid}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>
                  {item.diskon ? (
                    <div>
                      <span className="line-through text-gray-400 text-xs">
                        {item.harga.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </span>
                      <br />
                      <span>
                        {(
                          item.harga -
                          (item.harga * parseInt(item.diskon)) / 100
                        ).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  ) : (
                    item.harga.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })
                  )}
                </TableCell>
                <TableCell>
                  {item.total.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>
                  <div className="md:flex gap-4">
                    <div className="md:flex gap-4">
                      <PlusCircle
                        onClick={() => handleAddQty(item.id.toString())}
                        className="cursor-pointer w-5 h-5 text-green-500"
                      />
                      <span className="cursor-pointer">{item.qty}</span>
                      <MinusCircle
                        onClick={() => handleSubtractQty(item.id.toString())}
                        className="cursor-pointer w-5 h-5 text-red-500"
                      />
                    </div>
                    {" | "}
                    <Trash
                      onClick={() => handleRemoveItem(item.id.toString())}
                      className="cursor-pointer w-5 h-5 text-red-500"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableItemComponent;
