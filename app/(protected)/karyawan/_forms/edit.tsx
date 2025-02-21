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
import { Edit } from "lucide-react";
import { updateUserSchema } from "@/schemas/user";
import { useEffect, useState } from "react";
import { Role, User } from "@prisma/client";
import axios from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Cabang {
  id: number;
  nama: string;
}

const getCabang = async (): Promise<Cabang[]> => {
  const response = await fetch("/api/cabang").then((res) => res.json());
  return response.data;
};

interface EditFormProps {
  user: User;
}

export function EditForm({ user }: EditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cabang, setCabang] = useState<Cabang[]>([]);

  useEffect(() => {
    getCabang().then((data) => setCabang(data as Cabang[]));
  }, []);

  const form = useForm({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      nama: user.nama,
      username: user.username,
      email: user.email,
      cabangId: user.cabangId,
      role: user.role,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.put(`/api/user`, {
        ...data,
        id: user.id,
      });
      if (response.status === 200) {
        form.reset();
        toast.success("Pengguna berhasil diperbarui");
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
          <SheetTitle>Edit Kasir</SheetTitle>
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
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/\s/g, "-");
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
                      {...field}
                      value={field.value || ""}
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
                    value={field.value}
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
