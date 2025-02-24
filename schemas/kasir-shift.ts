import * as Yup from "yup";

export const KasirShiftSchema = Yup.object().shape({
  cabangId: Yup.string().uuid().required(),
  userId: Yup.string().uuid().required(),
  mulaiShift: Yup.date().required(),
  tutupShift: Yup.date().nullable(),
  saldoAwal: Yup.number().integer().min(0).required(),
  saldoAkhir: Yup.number().integer().min(0).nullable(),
  status: Yup.mixed().oneOf(["AKTIF", "TERTUTUP"]).required(),
});
