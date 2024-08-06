import express from 'express';

import {
  createCard,
  deleteCard,
  getAllGroupCards,
  getCardsToStudy,
  updateCard,
  updateCardStats,
} from '../controllers/cardController';

const router = express.Router();

router.get('/:groupId', getAllGroupCards);
router.get('/study/:groupId', getCardsToStudy);
router.patch('/:cardId', updateCardStats);
router.post('/:groupId', createCard);
router.put('/', updateCard);
router.delete('/:cardId', deleteCard);

export default router;
