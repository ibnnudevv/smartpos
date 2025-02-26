"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DraftTransaksiSchema } from "@/schemas/draft-transaksi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Barang, DetailDraftTransaksi, DraftTransaksi } from "@prisma/client";
import { Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { number, string } from "yup";

interface itemsInterface {
  diskon: number;
  harga: number;
  id: string;
  kode: string;
  nama: string;
  pid: string;
  qty: number;
  total: number;
}

export const DraftModal = ({
  information,
  items,
}: {
  information: {
    userId: string;
    cabangId: string;
  };
  items: itemsInterface[];
}) => {
  console.log("items", items);
  console.log("information", information);

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    resolver: yupResolver(DraftTransaksiSchema),
    defaultValues: {
      cabangId: information.cabangId,
      judul: "",
      deskripsi: "",
      DetailDraftTransaksi: [],
      userId: information.userId,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  console.log(form.formState.errors);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" /> DRAFT (F7)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Tambah Draft Transaksi</DialogTitle>
              <DialogDescription>
                Masukan detail transaksi yang akan di draft
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 border border-gray-200 rounded-lg">
              <h1 className=" font-semibold">Detail Transaksi</h1>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <TableCell>{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell className="text-right">
                        {item.total.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">
                      {items
                        .reduce((acc, curr) => acc + curr.total, 0)
                        .toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
