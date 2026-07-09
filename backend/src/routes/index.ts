import { Router } from 'express';

import cardRoutes from './cards';
import groupRoutes from './groups';
import wordRoutes from './words';

const router = Router();

router.use(cardRoutes);
router.use(groupRoutes);
router.use(wordRoutes);

export default router;
