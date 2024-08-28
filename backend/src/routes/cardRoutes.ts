import express from 'express';

import {
  createCard,
  deleteCard,
  getAllGroupCards,
  getWriteCards,
  updateCard,
  updateCardStats,
} from '../controllers/cardController';

const router = express.Router();

router.get('/:groupId', getAllGroupCards);
router.get('/study/write', getWriteCards);
router.post('/:groupId', createCard);
router.post('/', updateCardStats);
router.put('/', updateCard);
router.delete('/:cardId', deleteCard);

export default router;
