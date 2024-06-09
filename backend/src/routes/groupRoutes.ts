import express from 'express';

import {
  createGroup,
  deleteGroup,
  getAllGroups,
  updateGroup,
} from '../controllers/groupController';

const router = express.Router();

router.get('/', getAllGroups);
router.post('/', createGroup);
router.put('/:groupId', updateGroup);
router.delete('/:groupId', deleteGroup);

export default router;
