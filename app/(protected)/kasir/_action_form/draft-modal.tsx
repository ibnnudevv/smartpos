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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DraftTransaksiSchema } from "@/schemas/draft-transaksi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Cabang, User } from "@prisma/client";
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
import { toast } from "sonner";
import { useRefetch } from "@/context/refetch";

interface itemsInterface {
  diskon: number;
  harga: number;
  id: string;
  kode: string;
  nama: string;
  pid: string;
  qty: number;
  total: number;
}

export const DraftModal = ({
  userId,
  information,
  items,
}: {
  userId: string;
  information: {
    userId: string;
    cabangId: string;
  };
  items: itemsInterface[];
}) => {
  const { handleRefetch } = useRefetch();
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Cabang[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(DraftTransaksiSchema),
    values: {
      cabangId: information.cabangId,
      userId: userId,
      judul: "",
      deskripsi: "",
      DetailDraftTransaksi: [],
    },
    defaultValues: {
      cabangId: information.cabangId,
      judul: "",
      deskripsi: "",
      DetailDraftTransaksi: [],
      userId: userId,
    },
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

  useEffect(() => {
    fetchCabang();
  }, []);

  useEffect(() => {
    if (form.watch("cabangId")) {
      fetchUsers(form.watch("cabangId"));
    }
  }, [form.watch("cabangId")]);

  const onSubmit = async (data: any) => {
    try {
      const detailDraftTransaksi = items.map((item) => ({
        barangId: item.id,
        qty: item.qty,
        harga: item.harga,
        diskon: item.diskon,
        total: item.total,
      }));

      const payload = {
        ...data,
        DetailDraftTransaksi: detailDraftTransaksi.map((item) => ({
          barangId: item.barangId,
          jumlah: item.qty,
          harga: item.harga,
          diskon: item.diskon,
        })),
      };

      const response = await axios.post("/api/draft-transaksi", payload);

      if (response.status === 201) {
        toast.success(response.data.message);
        setIsOpen(false);
        handleRefetch("reload-page-after-store-draft");
      } else {
        console.error("Error saving draft transaksi:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving draft transaksi:", error);
    }
  };

  console.log(form.formState.errors);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" /> DRAFT (F7)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <ScrollArea className="h-[500px]" scrollHideDelay={0}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <DialogHeader>
                <DialogTitle>Tambah Draft Transaksi</DialogTitle>
                <DialogDescription>
                  Masukan detail transaksi yang akan di draft
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
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        onChange={field.onChange}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 border border-gray-200 rounded-lg">
                <h1 className=" font-semibold">Detail Transaksi</h1>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.kode}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell className="text-right">
                          {item.total.toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">
                        {items
                          .reduce((acc, curr) => acc + curr.total, 0)
                          .toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

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
