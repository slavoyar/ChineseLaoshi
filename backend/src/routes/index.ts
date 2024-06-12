import express from 'express';

import authRoutes from './authRoutes';
import cardRoutes from './cardRoutes';
import groupRoutes from './groupRoutes';
import wordRoutes from './wordRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cards', cardRoutes);
router.use('/groups', groupRoutes);
router.use('/words', wordRoutes);

export default router;
