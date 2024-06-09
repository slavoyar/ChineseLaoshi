import express from 'express';
import cardRoutes from './cardRoutes';
import groupRoutes from './groupRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cards', cardRoutes);
router.use('/groups', groupRoutes);

export default router;