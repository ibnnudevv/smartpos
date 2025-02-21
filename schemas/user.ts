import { Role } from "@prisma/client";
import * as Yup from "yup";

export const userSchema = Yup.object().shape({
  nama: Yup.string().required("Nama wajib diisi"),
  username: Yup.string().required("Username wajib diisi"),
  email: Yup.string().email("Email tidak valid").nullable(),
  password: Yup.string().required("Password wajib diisi"),
  cabangId: Yup.string().required("Cabang wajib diisi"),
  role: Yup.string()
    .oneOf(Object.values(Role), "Role tidak valid")
    .required("Role wajib diisi"),
});

export const updateUserSchema = userSchema.shape({
  password: Yup.string().nullable().notRequired(),
});
