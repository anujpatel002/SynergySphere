// server/src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, refreshToken, getMe, logout } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate, authSchemas } from '../utils/validation';

const router = Router();

router.post('/register', validate(authSchemas.register), register);
router.post('/login', validate(authSchemas.login), login);
router.post('/refresh', validate(authSchemas.refreshToken), refreshToken);
router.post('/logout', logout); // Logout doesn't need a body, but the endpoint itself is simple
router.get('/me', protect, getMe);

export default router;