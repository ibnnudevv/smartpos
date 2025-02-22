"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CirclePlus } from "lucide-react";
import { generateTx } from "./_helper/generate-tx";
import { useEffect, useState } from "react";

const items = [
  {
    id: 1,
    kode: "001003",
    nama: "Give Me Almond",
    pid: "",
    qty: 3,
    harga: 30000,
    diskon: "0",
    total: 90000,
  },
  {
    id: 2,
    kode: "001013",
    nama: "Spaghetti Meatball",
    pid: "",
    qty: 2,
    harga: 29500,
    diskon: "10%+5000",
    total: 43100,
  },
];

import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import TableItemComponent from "./_component/table-item";
import FooterComponent from "./_component/footer";
import ButtonWidgetComponent from "./_component/button-widget";
import SidebarWidgetComponent from "./_component/sidebar-widget";
import HeaderComponent from "./_component/header";

export default function Page() {
  const [tx, setTx] = useState("");
  const [selectedItem, setSelectedItem] = useState<ComboboxOptions>();
  const [optionItems, setOptionItems] = useState<ComboboxOptions[]>([]);

  const fetchItems = async () => {
    const response = await fetch("/api/barang").then((res) => res.json());
    const data = response?.data;
    const items = data.map((item: any) => ({
      id: item.id,
      value: item.nama,
      label: item.kode + " | " + item.nama,
    }));
    setOptionItems(items);
  };

  useEffect(() => {
    setTx(generateTx());
    fetchItems();
  }, []);

  const handleSelect = (option: ComboboxOptions) => {
    setSelectedItem(option);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent tx={tx} />
      <main className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="space-y-4">
                <Button variant={"default"} className="w-fit">
                  <CirclePlus fill="#000" className="w-6 h-6 text-white" />
                  <span>TAMBAH ITEM (F1)</span>
                </Button>
                <Combobox
                  options={optionItems}
                  placeholder="Pilih Item"
                  selected={selectedItem?.value ?? ""}
                  onChange={handleSelect}
                />
                <div className="text-right">
                  <div className="text-muted-foreground">Total</div>
                  <div className="text-4xl font-bold">Rp. 126,445</div>
                </div>
              </CardHeader>

              <CardContent>
                <ButtonWidgetComponent />
                <TableItemComponent items={items} />
                <FooterComponent />
              </CardContent>
            </Card>
          </div>

          <SidebarWidgetComponent />
        </div>
      </main>
    </div>
  );
}
