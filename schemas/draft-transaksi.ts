import * as Yup from "yup";

const DraftTransaksiSchema = Yup.object().shape({
  judul: Yup.string().required("Judul harus diisi"),
  deskripsi: Yup.string().nullable(),
  userId: Yup.string().required("ID Pengguna harus diisi"),
  cabangId: Yup.string().required("ID Cabang harus diisi"),
  DetailDraftTransaksi: Yup.array().of(
    Yup.object().shape({
      barangId: Yup.string().required("ID Barang harus diisi"),
      jumlah: Yup.number()
        .integer()
        .min(1, "Jumlah harus lebih dari 0")
        .required("Jumlah harus diisi"),
      harga: Yup.number()
        .integer()
        .min(0, "Harga tidak boleh negatif")
        .required("Harga harus diisi"),
      diskon: Yup.number()
        .integer()
        .min(0, "Diskon tidak boleh negatif")
        .nullable(),
    })
  ),
});

const DetailDraftTransaksiSchema = Yup.object().shape({
  draftTransaksiId: Yup.string()
  .required("ID Draft Transaksi harus diisi"),
  barangId: Yup.string().required("ID Barang harus diisi"),
  jumlah: Yup.number()
    .integer()
    .min(1, "Jumlah harus lebih dari 0")
    .required("Jumlah harus diisi"),
  harga: Yup.number()
    .integer()
    .min(0, "Harga tidak boleh negatif")
    .required("Harga harus diisi"),
  diskon: Yup.number()
    .integer()
    .min(0, "Diskon tidak boleh negatif")
    .nullable(),
});

export { DraftTransaksiSchema, DetailDraftTransaksiSchema };
