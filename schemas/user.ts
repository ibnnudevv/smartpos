import { Role } from '@prisma/client';
import * as Yup from 'yup';

const userSchema = Yup.object().shape({
    nama: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().nullable(),
    password: Yup.string().required(),
    cabangId: Yup.number().required(),
    role: Yup.string().oneOf(Object.values(Role)).required(),
});

export default userSchema;