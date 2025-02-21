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
import { KategoriBarang } from "@prisma/client";
import axios from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { kategoriBarangSchema } from "@/schemas/kategori-barang";

interface EditFormProps {
  kategoriBarang: KategoriBarang;
}

export function EditForm({ kategoriBarang }: EditFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(kategoriBarangSchema),
    defaultValues: {
      nama: kategoriBarang.nama,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.put(`/api/kategori-barang`, {
        ...data,
        id: kategoriBarang.id,
      });
      if (response.status === 200) {
        form.reset();
        toast.success("Kategori barang berhasil diperbarui");
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
          <SheetTitle>Edit Kategori Barang</SheetTitle>
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
