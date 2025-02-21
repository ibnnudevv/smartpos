import * as Yup from 'yup';
import { JenisLogBarang } from '@prisma/client';

export const logBarangSchema = Yup.object().shape({
    barangId: Yup.number().required('Barang wajib diisi'),
    cabangId: Yup.number().required('Cabang wajib diisi'),
    jumlah: Yup.number()
        .required('Jumlah wajib diisi')
        .integer('Jumlah harus berupa angka bulat')
        .min(1, 'Jumlah harus lebih dari 0'),
    harga: Yup.number()
        .nullable()
        .notRequired()
        .integer('Harga harus berupa angka bulat')
        .min(0, 'Harga tidak boleh negatif'),
    total: Yup.number()
        .nullable()
        .notRequired()
        .integer('Total harus berupa angka bulat')
        .min(0, 'Total tidak boleh negatif'),
    jenis: Yup.string()
        .oneOf(Object.values(JenisLogBarang), 'Jenis log barang tidak valid')
        .required('Jenis wajib diisi'),
    createdUserId: Yup.number().required('User pembuat wajib diisi'),
});
