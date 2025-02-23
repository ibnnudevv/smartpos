"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Plus } from "lucide-react";
import { kategoriBarangSchema } from "@/schemas/kategori-barang";
import { useEffect, useState } from "react";
import axios from "axios";
import { KategoriBarang } from "@prisma/client";
import { useRefetch } from "@/context/refetch";

interface KategoriBarangInterface {
  id: string;
  nama: string;
}

const getKategoriBarang = async (): Promise<KategoriBarang[]> => {
  const response = await fetch("/api/kategori-barang").then((res) =>
    res.json()
  );
  return response.data;
};

export function AddForm() {
  const { handleRefetch } = useRefetch();
  const [isOpen, setIsOpen] = useState(false);
  const [cabang, setKategoriBarang] = useState<KategoriBarangInterface[]>([]);

  useEffect(() => {
    getKategoriBarang().then((data) =>
      setKategoriBarang(data as KategoriBarangInterface[])
    );
  }, []);

  const form = useForm({
    resolver: yupResolver(kategoriBarangSchema),
    defaultValues: {
      nama: "",
    },
  });

  const onSubmit = async (data: any) => {
    await axios
      .post("/api/kategori-barang", data)
      .then((response) => {
        if (response.status == 201) {
          form.reset();
          toast.success("Kategori barang berhasil ditambahkan");
          setIsOpen(false);
          handleRefetch("fetch-kategori-barang");
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Terjadi kesalahan, silahkan coba lagi");
        }
      });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <SheetTrigger asChild>
        <Button variant="info" onClick={() => setIsOpen(!isOpen)}>
          <Plus className="h-4 w-4" />
          Tambah Kategori Barang
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Kategori Barang</SheetTitle>
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
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama kategori"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="lg:flex gap-x-2">
              <Button type="submit">Simpan Perubahan</Button>
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
