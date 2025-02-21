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
import { stokSchema } from "@/schemas/stok";
import { useEffect, useState } from "react";
import axios from "axios";
import { Barang, Cabang } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRefetch } from "@/context/refetch";

export function AddForm() {
  const { handleRefetch } = useRefetch();
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [listBarang, setListBarang] = useState<Barang[]>([]);
  const [listCabang, setListCabang] = useState<Cabang[]>([]);

  const getBarangAndCabang = async () => {
    const [barang, cabang] = await Promise.all([
      axios.get("/api/barang"),
      axios.get("/api/cabang?isActive=true"),
    ]);

    setListBarang(barang.data.data || []);
    setListCabang(cabang.data.data || []);
  };

  useEffect(() => {
    getBarangAndCabang();
  }, []);

  const form = useForm({
    resolver: yupResolver(stokSchema),
    defaultValues: {
      barangId: "",
      cabangId: "",
      jumlah: 0,
    },
  });

  const onSubmit = async (data: any) => {
    const username = user?.username;
    const payload = {
      ...data,
    };

    if (username != "superadmin") {
      payload.createdUserId = user?.id;
    }

    const response = await axios.post("/api/stok", payload);
    if (response.status === 201) {
      toast.success("Stok berhasil ditambahkan");
      setIsOpen(false);
      form.reset();
      handleRefetch("fetch-stok");
    }

    if (response.status === 400) {
      toast.error(response.data.message);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <SheetTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(!isOpen)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Stok
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
              name="barangId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barang</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih barang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {listBarang.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.nama}
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
              name="cabangId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cabang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih cabang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {listCabang.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.nama}
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
              name="jumlah"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Stok</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
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
