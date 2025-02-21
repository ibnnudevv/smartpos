"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Barang, KategoriBarang } from "@prisma/client";
import axios from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { barangSchema } from "@/schemas/barang";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [listKategoriBarang, setListKategoriBarang] = useState<
    KategoriBarang[]
  >([]);

  useEffect(() => {
    axios.get("/api/kategori-barang").then((res) => {
      setListKategoriBarang(res.data.data);
    });
  }, []);

  const generateCode = () => {
    // BRG-0001
    const kode = "BRG-";
    const random = Math.floor(Math.random() * 10000);
    return kode + random.toString().padStart(4, "0");
  };

  const form = useForm({
    resolver: yupResolver(barangSchema),
    defaultValues: {
      kode: generateCode(),
      nama: "",
      kategoriBarangId: undefined,
      harga: 0,
      diskon: 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`/api/barang`, data);
      if (response.status === 201) {
        form.reset();
        toast.success("Barang berhasil ditambahkan");
        setIsOpen(false);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan, silahkan coba lagi");
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <SheetTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Tambah Barang</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Barang</SheetTitle>
          <SheetDescription>
            Isi formulir di bawah ini dan klik simpan.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4 h-[calc(100%-4rem)] overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kode barang"
                      type="text"
                      {...field}
                      value={field.value ?? ""}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama barang"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kategoriBarangId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Barang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kategori barang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {listKategoriBarang.map((kategori) => (
                            <SelectItem
                              key={kategori.id}
                              value={kategori.id.toString()}
                            >
                              {kategori.nama}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan harga barang"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diskon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diskon (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan diskon (opsional)"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Diskon dalam persen, contoh: 10
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="lg:flex gap-x-2">
              <Button type="submit">Simpan</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
