import express from 'express';
import authControllers from '../controllers/auth.controllers.js';
import seedController from '../controllers/seed.controller.js';
const router = express.Router();

router.post('/register', authControllers.registerDoctor);
router.post('/login', authControllers.loginDoctor);
router.post('/seed', seedController.seedDemoAccount);

export default router;
