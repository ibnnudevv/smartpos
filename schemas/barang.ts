import * as Yup from "yup";

export const barangSchema = Yup.object().shape({
  nama: Yup.string().required("Nama barang harus diisi"),
  kategoriBarangId: Yup.string().required("Kategori barang harus diisi"),
  harga: Yup.number().required("Harga barang harus diisi"),
  diskon: Yup.number().nullable().notRequired(),
});
