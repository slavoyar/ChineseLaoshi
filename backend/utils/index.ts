import { CustomError } from '@configs/errors';
import { PrismaPromise } from '@prisma/client';

export const getUuid = (id: number) => `00000000-0000-0000-0000-${id.toString().padStart(12, '0')}`;

export function mockPrismaPromise<T, R = PrismaPromise<T>>(data: T): R {
  getOrThrow(data);
  const promise = Promise.resolve(data);
  return new Proxy(promise, {
    get(target, prop, receiver) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return target[prop].bind(target);
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as R;
}

export const getOrThrow = <T>(value: T | null | undefined): T => {
  if (value === null || value === undefined) {
    throw new CustomError('entityNotFoundError');
  }
  return value;
};
