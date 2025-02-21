import * as Yup from 'yup';

export const cabangSchema = Yup.object().shape({
    nama: Yup.string().required('Nama wajib diisi'),
});
