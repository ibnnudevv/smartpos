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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { userSchema } from "@/schemas/user";
import { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import axios from "axios";

interface Cabang {
  id: number;
  nama: string;
}

const getCabang = async (): Promise<Cabang[]> => {
  const response = await fetch("/api/cabang").then((res) => res.json());
  return response.data;
};

export function AddForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [cabang, setCabang] = useState<Cabang[]>([]);

  useEffect(() => {
    getCabang().then((data) => setCabang(data as Cabang[]));
  }, []);

  const form = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      nama: "",
      username: "",
      email: "",
      password: "",
      cabangId: undefined,
      role: undefined,
    },
  });

  const onSubmit = async (data: any) => {
    await axios
      .post("/api/user", data)
      .then((response) => {
        if (response.status == 201) {
          form.reset();
          toast.success("Kasir berhasil ditambahkan");
          setIsOpen(false);
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
          Tambah Kasir
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah Kasir</SheetTitle>
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
                      placeholder="Masukkan nama lengkap"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan username"
                      onInput={(e) => {
                        // replace whitespace with dash
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/\s/g, "-");
                        // change to lowercase
                        target.value = target.value.toLowerCase();

                        field.onChange(e);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Contoh: kasir-1</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan email"
                      type="email"
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Masukkan kata sandi"
                      {...field}
                    />
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
                  <FormLabel>Pilih Cabang</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih cabang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cabang.map((cabang) => (
                        <SelectItem
                          key={cabang.id}
                          value={cabang.id.toString()}
                        >
                          {cabang.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posisi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih posisi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Role).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
