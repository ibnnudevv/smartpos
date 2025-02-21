import * as Yup from 'yup';

export const kategoriBarangSchema = Yup.object().shape({
    nama: Yup.string().required('Nama kategori barang harus diisi')
});
