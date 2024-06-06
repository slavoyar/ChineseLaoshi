import express from 'express'
import { PrismaClient } from '@prisma/client';
import { CardController } from '../controllers/cardController';

export const getCardRoutes = (prisma: PrismaClient) => {
  const router = express.Router();
  
  const controller = new CardController(prisma);
  
  router.get('/:groupId', controller.getAllGroupCards);
  router.post('/:groupId', controller.createCard);
  router.put('/:cardId', controller.updateCard);
  router.delete('/:cardId', controller.deleteCard)
  
  return router
}

