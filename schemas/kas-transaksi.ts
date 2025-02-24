import * as Yup from "yup";

const KasTransaksiSchema = Yup.object().shape({
  kasirShiftId: Yup.string().uuid().required(),
  jenis: Yup.mixed()
    .oneOf(["KAS_MASUK", "KAS_KELUAR", "PENJUALAN", "SETORAN", "PENARIKAN"])
    .required(),
  jumlah: Yup.number().integer().min(0).required(),
  keterangan: Yup.string().nullable(),
});
