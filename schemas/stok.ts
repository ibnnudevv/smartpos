import * as Yup from "yup";

export const stokSchema = Yup.object().shape({
  barangId: Yup.string()
    .required("Barang wajib diisi")
    .defined("Barang wajib diisi"),
  cabangId: Yup.string()
    .required("Cabang wajib diisi")
    .defined("Cabang wajib diisi"),
  jumlah: Yup.number()
    .required("Jumlah wajib diisi")
    .integer("Jumlah harus berupa angka bulat")
    .min(1, "Jumlah stok minimal 1"),
});
