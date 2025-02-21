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
import { useState } from "react";
import { Cabang } from "@prisma/client";
import axios from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cabangSchema } from "@/schemas/cabang";
import { useRefetch } from "@/context/refetch";

interface EditFormProps {
  cabang: Cabang;
}

export function EditForm({ cabang }: EditFormProps) {
  const { handleRefetch } = useRefetch();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(cabangSchema),
    defaultValues: {
      nama: cabang.nama,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.put(`/api/cabang`, {
        ...data,
        id: cabang.id,
      });
      if (response.status === 200) {
        form.reset();
        toast.success("Cabang berhasil diperbarui");
        setIsOpen(false);
        handleRefetch("fetch-cabang");
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
          <SheetTitle>Edit Cabang</SheetTitle>
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
                      placeholder="Masukkan nama cabang"
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
