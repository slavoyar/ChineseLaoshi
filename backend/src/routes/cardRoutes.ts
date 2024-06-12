import express from 'express';

import {
  createCard,
  deleteCard,
  getAllGroupCards,
  updateCard,
} from '../controllers/cardController';

const router = express.Router();

router.get('/:groupId', getAllGroupCards);
router.post('/:groupId', createCard);
router.put('/', updateCard);
router.delete('/:cardId', deleteCard);

export default router;
