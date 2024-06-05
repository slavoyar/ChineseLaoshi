import express from 'express'

const router = express.Router();

router.get('/:groupId');
router.post('/:groupId');
router.put('/:cardId');
router.delete('/:cardId')

export default router;
