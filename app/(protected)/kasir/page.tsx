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

    const items = data.map((item) => ({
      id: item.barang.id,
      kode: item.barang.kode,
      nama: item.barang.nama,
      pid: null,
      qty: 1,
      harga:
        (item?.barang?.diskon ?? 0) > 0
          ? item.barang.harga -
            item.barang.harga * ((item.barang.diskon ?? 0) / 100)
          : item.barang.harga,
      diskon: item.barang.diskon ?? 0,
      total:
        (item?.barang?.diskon ?? 0) > 0
          ? item.barang.harga -
            item.barang.harga * ((item.barang.diskon ?? 0) / 100)
          : item.barang.harga,
      stok: item.jumlah,
    }));

    setOptionItems(
      items.map((item) => ({
        value: item.kode,
        kode: item.kode,
        diskon: item.diskon,
        nama: item.nama,
        pid: item.pid ?? "",
        qty: item.qty,
        total: item.diskon
          ? item.harga - item.harga * (item.diskon / 100)
          : item.harga,
        stok: item.stok,
        label: `${item.kode} | ${item.nama} | ${
          item.diskon ? `Diskon ${item.diskon}% | ` : ""
        }Rp. ${item.harga.toLocaleString()} | [stok: ${item.stok}]`,
        id: item.id,
        harga: item.diskon
          ? item.harga - item.harga * (item.diskon / 100)
          : item.harga,
      }))
    );
  };

  const handleAddQty = (id: string) => {
    const newItems: typeof tableItems = tableItems.map((item) => {
      if (item.id === id) {
        const stok = optionItems.find((opt) => opt.id === id)?.stok;
        if (stok !== undefined && item.qty + 1 > stok) {
          toast.error("Stok tidak cukup");
          return item;
        }

        item.qty += 1;
        item.total = item.qty * item.harga;

        setTransaction((prev: Transaksi) => ({
          ...prev,
          subTotal: (prev.subTotal ?? 0) + item.harga,
          total: (prev.total ?? 0) + item.harga,
        }));
      }
      return item;
    });
    setTableItems(newItems);
  };

  const handleSubtractQty = (id: string) => {
    const newItems = tableItems
      .map((item) => {
        if (item.id === id) {
          if (item.qty === 1) {
            setTransaction((prev: Transaksi) => ({
              ...prev,
              subTotal: (prev.subTotal ?? 0) - item.harga,
              total: (prev.total ?? 0) - item.harga,
            }));
            return null;
          }

          item.qty -= 1;
          item.total = item.qty * item.harga;

          setTransaction((prev: Transaksi) => ({
            ...prev,
            subTotal: (prev.subTotal ?? 0) - item.harga,
            total: (prev.total ?? 0) - item.harga,
          }));
        }
        return item;
      })
      .filter(Boolean);

    setTableItems(newItems);
  };

  const handleRemoveItem = (id: string) => {
    const removedItem = tableItems.find((item) => item.id === id);
    if (removedItem) {
      setTransaction((prev: Transaksi) => ({
        ...prev,
        subTotal: (prev.subTotal ?? 0) - removedItem.harga * removedItem.qty,
        total: (prev.total ?? 0) - removedItem.harga * removedItem.qty,
      }));
    }

    const newItems = tableItems.filter((item) => item.id !== id);
    setTableItems(newItems);
  };

  const handleSelect = (option: ComboboxOptions) => {
    setSelectedItem(option);

    const item = optionItems.find((item) => item.value === option.value);
    if (item) {
      const newItem = {
        id: item.id,
        kode: item.kode,
        nama: item.label.split(" | ")[1],
        pid: item.kode,
        qty: 1,
        harga: item.diskon
          ? (item.harga ?? 0) - (item.harga ?? 0) * (Number(item.diskon) / 100)
          : item.harga,
        diskon: item.diskon ?? 0,
        total: item.diskon
          ? Number(item.harga ?? 0) -
            Number(item.harga ?? 0) * (Number(item.diskon ?? 0) / 100)
          : item.harga,
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
              total: (existingItem.qty + 1) * existingItem.harga,
            };
          }
          return existingItem;
        });

        setTableItems(updatedItems);

        setTransaction((prev: Transaksi) => ({
          ...prev,
          subTotal: (prev.subTotal ?? 0) + (item.harga ?? 0),
          total: (prev.total ?? 0) + (item.harga ?? 0),
        }));

        return;
      }

      setTableItems([...tableItems, newItem]);
      setTransaction((prev: Transaksi) => ({
        ...prev,
        subTotal: (prev.subTotal ?? 0) + (item.harga ?? 0),
        total: (prev.total ?? 0) + (item.harga ?? 0),
      }));
    }
  };

  const handleDiskon = (id: string, diskon: string) => {
    // if diskon contains %, then calculate the diskon
    const diskonValue = diskon.includes("%")
      ? (parseInt(diskon.replace("%", "")) / 100) *
        tableItems.find((item) => item.id === id).harga
      : parseInt(diskon);

    const newItems = tableItems.map((item) => {
      if (item.id === id) {
        item.diskon = diskon;
        item.total = item.harga - diskonValue;
      }
      return item;
    });

    setTableItems(newItems);
    setTransaction((prev: Transaksi) => ({
      ...prev,
      total: (prev.total ?? 0) - diskonValue,
    }));
  };

  useEffect(() => {
    setTx(generateTx());
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent tx={tx} />
      <main className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="space-y-4">
                <Link href={"/barang"}>
                  <Button variant={"default"} className="w-fit">
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
                />
                <FooterComponent
                  diskon={transaction.diskon}
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
