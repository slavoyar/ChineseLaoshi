import express from 'express';

import authRoutes from './authRoutes';
import cardRoutes from './cardRoutes';
import groupRoutes from './groupRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cards', cardRoutes);
router.use('/groups', groupRoutes);

export default router;
