import { User } from '@prisma/client';
import { getUuid } from '@utils';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

export const users: User[] = [
  {
    id: getUuid(1),
    email: 'slavoyar@mail.com',
    username: 'slavoyar',
    password: bcrypt.hashSync('slavoyar', SALT_ROUNDS),
  },
  {
    id: getUuid(2),
    email: 'test@mail.com',
    username: 'test',
    password: bcrypt.hashSync('test', SALT_ROUNDS),
  },
];
