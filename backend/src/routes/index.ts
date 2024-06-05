import express from 'express';
import cardRoutes from './CardRoutes';
import groupRoutes from './GroupRoutes';
import wordRoutes from './WordRoutes';

const router = express.Router();

router.use('/cards', cardRoutes);
router.use('/words', wordRoutes);
router.use('/groups', groupRoutes);

export default router;