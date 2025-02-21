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

interface EditFormProps {
  barang: Barang;
}

export function EditForm({ barang }: EditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [listKategoriBarang, setListKategoriBarang] = useState<
    KategoriBarang[]
  >([]);

  useEffect(() => {
    const response = axios.get("/api/kategori-barang");
    response.then((res) => {
      setListKategoriBarang(res.data.data);
    });
  }, []);

  const form = useForm({
    resolver: yupResolver(barangSchema),
    defaultValues: {
      kode: barang.kode,
      nama: barang.nama,
      kategoriBarangId: barang.kategoriBarangId,
      harga: barang.harga,
      diskon: barang.diskon,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.put(`/api/barang`, {
        ...data,
        id: barang.id,
      });
      if (response.status === 200) {
        form.reset();
        toast.success("Barang berhasil diperbarui");
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
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => setIsOpen(true)}
        >
          Edit
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Barang</SheetTitle>
          <SheetDescription>
            Ubah formulir di bawah ini dan klik simpan.
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
                    <Select {...field} value={String(field.value)}>
                      <SelectTrigger>
                        <SelectValue>
                          {
                            listKategoriBarang.find(
                              (kategori) => kategori.id === field.value
                            )?.nama
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {listKategoriBarang.map((kategori) => (
                          <SelectItem
                            key={kategori.id}
                            value={kategori.id.toString()}
                          >
                            {kategori.nama}
                          </SelectItem>
                        ))}
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
                  <FormLabel>Diskon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan diskon (opsional)"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
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
