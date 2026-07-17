import express from 'express';
import authControllers from '../controllers/auth.controllers.js';
import seedController from '../controllers/seed.controller.js';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', authControllers.registerDoctor);
router.post('/login', authControllers.loginDoctor);
router.post('/seed', seedController.seedDemoAccount);
router.delete('/me', authenticationMiddleware, authControllers.deleteAccount);

export default router;
