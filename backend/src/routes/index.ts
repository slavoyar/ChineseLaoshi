import express from 'express';
import cardRoutes from './cardRoutes';

const router = express.Router();

router.use('/cards', cardRoutes);

export default router;