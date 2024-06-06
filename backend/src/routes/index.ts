import express from 'express';
import { PrismaClient } from '@prisma/client';
import { getCardRoutes } from './cardRoutes';

export const getRoutes = (prisma: PrismaClient) => {
  const router = express.Router();

  router.use('/cards', getCardRoutes(prisma));
  
  return router;
}
