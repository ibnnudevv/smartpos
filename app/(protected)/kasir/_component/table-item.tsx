import React, { FC, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface Item {
  id: number;
  kode: string;
  nama: string;
  pid: string;
  qty: number;
  harga: number;
  diskon: string;
  total: number;
}

interface TableItemComponentProps {
  items: Item[];
  handleAddQty: (id: string) => void;
  handleSubtractQty: (id: string) => void;
  handleRemoveItem: (id: string) => void;
  handleChangeQty: (id: string, qty: number) => void;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

const TableItemComponent: FC<TableItemComponentProps> = ({
  items,
  handleAddQty,
  handleSubtractQty,
  handleRemoveItem,
  handleChangeQty,
}) => {
  const inputRefs = useRef<
    Record<number, React.RefObject<HTMLInputElement | null>>
  >({});

  useEffect(() => {
    items.forEach((item) => {
      if (!inputRefs.current[item.id]) {
        inputRefs.current[item.id] = React.createRef();
      }
    });
  }, [items]);

  const handleRowClick = (itemId: number) => {
    if (inputRefs.current[itemId] && inputRefs.current[itemId].current) {
      inputRefs.current[itemId].current?.focus();
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Kode Item</TableHead>
            <TableHead>Nama Item</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Ubah | Hapus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id} onClick={() => handleRowClick(item.id)}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.kode}</TableCell>
              <TableCell>{item.nama}</TableCell>
              <TableCell>
                <Input
                  ref={inputRefs.current[item.id]}
                  value={item.qty}
                  className="w-24"
                  type="number"
                  onInput={(e) => {
                    // prevent 0 or isNaN or nagative
                    const value = parseInt(e.currentTarget.value) || 1;
                    handleChangeQty(item.id.toString(), value);
                  }}
                />
              </TableCell>
              <TableCell>
                {item.diskon ? (
                  <div>
                    <span className="line-through text-gray-400 text-xs">
                      {formatCurrency(item.harga)}
                    </span>
                    <br />
                    <span>
                      {formatCurrency(
                        item.harga - (item.harga * parseInt(item.diskon)) / 100
                      )}
                    </span>
                  </div>
                ) : (
                  formatCurrency(item.harga)
                )}
              </TableCell>
              <TableCell>{formatCurrency(item.total)}</TableCell>
              <TableCell>
                <div className="md:flex gap-2 items-center">
                  <Separator orientation="vertical" className="h-5" />
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
