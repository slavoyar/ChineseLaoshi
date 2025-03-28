import express from 'express';

import authRoutes from './auth';
import cardRoutes from './cards';
import groupRoutes from './groups';
import wordRoutes from './words';

const router = express.Router();

router.use(authRoutes);
router.use(groupRoutes);
router.use(wordRoutes);
router.use(cardRoutes);

export default router;
