import express from 'express';
import { deleteDocument, updateDocument } from '../controllers/documents.controllers.js';

const router = express.Router();

router.patch('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;
