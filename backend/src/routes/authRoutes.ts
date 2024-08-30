import express from 'express';

import { login, register, resetPassword, updatePassword } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

export default router;
