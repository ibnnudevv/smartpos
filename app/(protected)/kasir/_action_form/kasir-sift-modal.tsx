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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Cabang, KasirShift, User } from "@prisma/client";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRefetch } from "@/context/refetch";
import { KasirShiftSchema } from "@/schemas/kasir-shift";
import { toast } from "sonner";

export const KasirSift = ({ userId }: { userId: string }) => {
  const { handleRefetch } = useRefetch();
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Cabang[]>([]);
  const [kasirSift, setKasirSift] = useState<KasirShift>();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(KasirShiftSchema),
    ...(kasirSift && {
      values: {
        ...kasirSift,
        saldoAwal: kasirSift?.saldoAkhir
          ? kasirSift.saldoAkhir
          : kasirSift.saldoAwal,
      },
    }),
    // defaultValues: {
    //   mulaiShift: new Date(),
    //   status: "AKTIF",
    // },
  });

  const fetchCabang = async () => {
    const response = await axios.get(`/api/cabang?hasMember=true`);
    const data = response.data.data;
    if (!data) return;
    setBranches(data);
  };

  const fetchUsers = async (cabangId: string) => {
    const response = await axios.get(`/api/user?cabangId=${cabangId}`);
    const data = response.data.data;
    if (!data) return;
    setUsers(data);
  };
  const fetchKasirShift = async (cabangId: string, userId: string) => {
    const response = await axios.get(
      `/api/kasir-shift?cabangId=${cabangId}&userId=${userId}`
    );
    const data = response.data.data;
    if (!data) return;
    setKasirSift(data);
  };

  useEffect(() => {
    fetchCabang();
  }, []);

  useEffect(() => {
    if (form.watch("cabangId") || form.watch("userId")) {
      fetchUsers(form.watch("cabangId"));
      fetchKasirShift(form.watch("cabangId"), form.watch("userId"));
    }
  }, [form.watch("cabangId"), form.watch("userId")]);

  const onSubmit = async (data: KasirShift) => {
    const isClose = data?.status === "TERTUTUP";
    console.log(isClose);
    const response = isClose
      ? await axios.post(`/api/kasir-shift?tipe=buka`, {
          ...data,
          status: "AKTIF",
        })
      : await axios.put(`/api/kasir-shift?tipe=tutup`, {
          ...data,
          status: "TERTUTUP",
        });
    if (response.status === 201) {
      toast.success("Kasir berhasil dibuka");
      setIsOpen(false);
      handleRefetch("fetch-kasir-shift");
    }
  };

  console.log(form.formState.errors);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" /> BUKA KASIR (CTRL+F11)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <ScrollArea className="h-[500px]" scrollHideDelay={0}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((val) =>
                onSubmit(val as unknown as KasirShift)
              )}
              className="flex flex-col gap-4"
            >
              <DialogHeader>
                <DialogTitle>Buka Kasir</DialogTitle>
                <DialogDescription>
                  Masukkan petugas dan cabang
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="cabangId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabang</FormLabel>
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
                        {branches.map((branchItem) => (
                          <SelectItem
                            key={branchItem.id}
                            value={branchItem.id.toString()}
                          >
                            {branchItem.nama}
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
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Petugas</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih petugas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((userItem) => (
                          <SelectItem
                            key={userItem.id}
                            value={userItem.id.toString()}
                          >
                            {userItem.nama}
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
                name="userId"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Input {...field} value={userId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {kasirSift && kasirSift?.status?.toString() === "TERTUTUP" ? (
                <FormField
                  control={form.control}
                  name="mulaiShift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Mulai</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          value={field?.value?.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="tutupShift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Tutup</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          value={String(field?.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {kasirSift && kasirSift?.saldoAkhir ? (
                <FormField
                  control={form.control}
                  name="saldoAwal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo Awal</FormLabel>
                      <FormControl>
                        <Input {...field} value={String(field.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="saldoAkhir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo Akhir</FormLabel>
                      <FormControl>
                        <Input {...field} value={String(field.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {kasirSift && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h1 className=" font-semibold">Detail Kasir</h1>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mulai</TableHead>
                        <TableHead>Tutup</TableHead>
                        <TableHead>Saldo Awal</TableHead>
                        <TableHead>Saldo Akhir</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow key={kasirSift.id}>
                        <TableCell>
                          {kasirSift?.mulaiShift &&
                            new Date(kasirSift?.mulaiShift).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {kasirSift?.tutupShift &&
                            new Date(kasirSift?.tutupShift)?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {kasirSift?.saldoAwal?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          {kasirSift?.saldoAkhir?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>{kasirSift?.status}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
