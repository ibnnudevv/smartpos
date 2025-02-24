"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CirclePlus } from "lucide-react";
import { generateTx } from "./_helper/generate-tx";
import { useEffect, useState } from "react";

import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import TableItemComponent from "./_component/table-item";
import FooterComponent from "./_component/footer";
import ButtonWidgetComponent from "./_component/button-widget";
import SidebarWidgetComponent from "./_component/sidebar-widget";
import HeaderComponent from "./_component/header";
import { Barang, Cabang, Stok, Transaksi } from "@prisma/client";
import { toast } from "sonner";
import Link from "next/link";

export default function Page() {
  const [isKasirOpened, setIsKasirOpened] = useState<boolean>(false);
  const [tx, setTx] = useState("");
  const [selectedItem, setSelectedItem] = useState<ComboboxOptions>();
  const [optionItems, setOptionItems] = useState<ComboboxOptions[]>([]);
  const [tableItems, setTableItems] = useState<any[]>([]);
  const [transaction, setTransaction] = useState<any>({
    diskon: 0,
    subTotal: 0,
    pajak: 0,
    total: 0,
  });

  const fetchCheckKasirOpened = async () => {};

  const fetchItems = async () => {
    const response = await fetch("/api/stok?isActive=true", {
      method: "GET",
    }).then((res) => res.json());
    const data: Stok &
      {
        barang: Barang;
        cabang: Cabang;
        jumlah: number;
      }[] = response?.data;

    const items = data.map((item) => {
      const basePrice = item.barang.harga;
      const discount = item.barang.diskon ?? 0;
      const finalPrice = calculateItemPrice(basePrice, discount);

      return {
        id: item.barang.id,
        kode: item.barang.kode,
        nama: item.barang.nama,
        pid: null,
        qty: 1,
        harga: basePrice,
        diskon: discount,
        total: finalPrice,
        stok: item.jumlah,
      };
    });

    setOptionItems(
      items.map((item) => ({
        value: item.kode,
        kode: item.kode,
        diskon: item.diskon,
        nama: item.nama,
        pid: item.pid ?? "",
        qty: item.qty,
        total: calculateItemPrice(item.harga, item.diskon),
        stok: item.stok,
        label: `${item.kode} | ${item.nama} | ${
          item.diskon ? `Diskon ${item.diskon}% | ` : ""
        }Rp. ${item.harga.toLocaleString()} | [stok: ${item.stok}]`,
        id: item.id,
        harga: item.harga,
      }))
    );
  };

  const calculateItemPrice = (basePrice: number, discount: number) => {
    const discountAmount = basePrice * (discount / 100);
    return basePrice - discountAmount;
  };

  const recalculateTransaction = (items: any[]) => {
    const subTotal = items.reduce((acc, item) => {
      const itemTotal = item.qty * calculateItemPrice(item.harga, item.diskon);
      return acc + itemTotal;
    }, 0);

    const total = subTotal - transaction.diskon + transaction.pajak;

    setTransaction((prev: Transaksi) => ({
      ...prev,
      subTotal,
      total: Math.max(0, total), // Ensure total never goes below 0
    }));
  };

  const handleAddQty = (id: string) => {
    const newItems = tableItems.map((item) => {
      if (item.id === id) {
        const stok = optionItems.find((opt) => opt.id === id)?.stok;
        if (stok !== undefined && item.qty + 1 > stok) {
          toast.error("Stok tidak cukup");
          return item;
        }

        return {
          ...item,
          qty: item.qty + 1,
          total: calculateItemPrice(item.harga, item.diskon) * (item.qty + 1),
        };
      }
      return item;
    });

    setTableItems(newItems);
    recalculateTransaction(newItems);
  };

  const handleSubtractQty = (id: string) => {
    const newItems = tableItems
      .map((item) => {
        if (item.id === id) {
          if (item.qty === 1) {
            return null;
          }

          return {
            ...item,
            qty: item.qty - 1,
            total: calculateItemPrice(item.harga, item.diskon) * (item.qty - 1),
          };
        }
        return item;
      })
      .filter(Boolean);

    setTableItems(newItems);
    recalculateTransaction(newItems);
  };

  const handleRemoveItem = (id: string) => {
    const newItems = tableItems.filter((item) => item.id !== id);
    setTableItems(newItems);
    recalculateTransaction(newItems);
  };

  const handleSelect = (option: ComboboxOptions) => {
    setSelectedItem(option);

    const item = optionItems.find((item) => item.value === option.value);
    if (item) {
      const harga = Number(item.harga) ?? 0;
      const diskon = Number(item.diskon) ?? 0;
      const finalPrice = calculateItemPrice(harga, diskon);
      const newItem = {
        id: item.id,
        kode: item.kode,
        nama: item.label.split(" | ")[1],
        pid: item.kode,
        qty: 1,
        harga: item.harga,
        diskon: item.diskon ?? 0,
        total: finalPrice,
      };

      const existItem = tableItems.find(
        (existingItem) => existingItem.id === newItem.id
      );

      if (existItem) {
        const stok = optionItems.find((opt) => opt.id === item.id)?.stok;
        if (stok !== undefined && existItem.qty + 1 > stok) {
          toast.error("Pilih item lain, stok tidak cukup");
          return;
        }

        const updatedItems = tableItems.map((existingItem) => {
          if (existingItem.id === newItem.id) {
            return {
              ...existingItem,
              qty: existingItem.qty + 1,
              total: finalPrice * (existingItem.qty + 1),
            };
          }
          return existingItem;
        });

        setTableItems(updatedItems);
        recalculateTransaction(updatedItems);
        return;
      }

      const updatedItems = [...tableItems, newItem];
      setTableItems(updatedItems);
      recalculateTransaction(updatedItems);
    }
  };

  const handleChangeQty = (id: string, qty: number) => {
    const newItems = tableItems.map((item) => {
      if (item.id === id) {
        const stok = optionItems.find((opt) => opt.id === id)?.stok;
        if (stok !== undefined && qty > stok) {
          toast.error("Stok tidak cukup");
          return item;
        }

        return {
          ...item,
          qty: qty,
          total: calculateItemPrice(item.harga, item.diskon) * qty,
        };
      }
      return item;
    });

    setTableItems(newItems);
    recalculateTransaction(newItems);
  };

  useEffect(() => {
    setTx(generateTx());
    fetchItems();
    fetchCheckKasirOpened();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent tx={tx} />
      <main className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="space-y-4">
                <Link href={"/barang"} className="w-fit">
                  <Button variant={"default"}>
                    <CirclePlus fill="#000" className="w-6 h-6 text-white" />
                    <span>TAMBAH ITEM (F1)</span>
                  </Button>
                </Link>
                <Combobox
                  options={optionItems}
                  placeholder="Pilih Item"
                  selected={selectedItem?.value ?? ""}
                  onChange={handleSelect}
                />
                <div className="text-right">
                  <div className="text-muted-foreground">Total</div>
                  <div className="text-4xl font-bold">
                    {transaction.total.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ButtonWidgetComponent
                  items={tableItems}
                  setItems={setTableItems}
                />
                <TableItemComponent
                  items={tableItems}
                  handleAddQty={handleAddQty}
                  handleSubtractQty={handleSubtractQty}
                  handleRemoveItem={handleRemoveItem}
                  handleChangeQty={handleChangeQty}
                />
                <FooterComponent
                  subTotal={transaction.subTotal}
                  pajak={transaction.pajak}
                  total={transaction.total}
                />
              </CardContent>
            </Card>
          </div>

          <SidebarWidgetComponent />
        </div>
      </main>
    </div>
  );
}
