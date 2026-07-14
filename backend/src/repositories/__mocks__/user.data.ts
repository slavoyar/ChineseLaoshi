import { User } from '@prisma/client';
import { getUuid } from '@utils';

export const users: User[] = [
  {
    id: getUuid(1),
    email: 'slavoyar@mail.com',
    username: 'slavoyar',
    password: '',
  },
  {
    id: getUuid(2),
    email: 'test@mail.com',
    username: 'test',
    password: '',
  },
];
