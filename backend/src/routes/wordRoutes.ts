import express from 'express';

import { searchWord } from '../controllers/wordController';

const router = express.Router();

router.get('/', searchWord);

export default router;
