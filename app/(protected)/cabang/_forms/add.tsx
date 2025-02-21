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
import { cabangSchema } from "@/schemas/cabang";
import { useState } from "react";
import axios from "axios";
import { useRefetch } from "@/context/refetch";

export function AddForm() {
  const { handleRefetch } = useRefetch();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(cabangSchema),
    defaultValues: {
      nama: "",
    },
  });

  const onSubmit = async (data: any) => {
    await axios
      .post("/api/cabang", data)
      .then((response) => {
        if (response.status == 201) {
          form.reset();
          toast.success("Cabang berhasil ditambahkan");
          setIsOpen(false);
          handleRefetch("fetch-cabang");
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
        <Button variant="default" onClick={() => setIsOpen(!isOpen)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Cabang
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Cabang</SheetTitle>
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
