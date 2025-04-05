import { prisma } from '@configs/prisma';
import { PrismaClient } from '@prisma/client';

// Mocking repositories
jest.mock('@repositories/group.repository');
jest.mock('@repositories/user.repository');
jest.mock('@repositories/word.repository');
jest.mock('@repositories/card.repository');

prisma.$transaction = jest.fn((transactionArray) => {
  if (Array.isArray(transactionArray)) {
    return Promise.all(transactionArray);
  }

  return transactionArray(prisma);
}) as unknown as PrismaClient['$transaction'];
