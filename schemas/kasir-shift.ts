import * as Yup from "yup";

export const KasirShiftSchema = Yup.object().shape({
  cabangId: Yup.string().required(),
  userId: Yup.string().required(),
  mulaiShift: Yup.date().required(),
  tutupShift: Yup.date().nullable(),
  saldoAwal: Yup.number().integer().min(0).required(),
  saldoAkhir: Yup.number().integer().min(0).nullable(),
  status: Yup.mixed().oneOf(["AKTIF", "TERTUTUP"]).required(),
});
