import express from 'express';
import patientsControllers from '../controllers/patients.controllers.js';
const router = express.Router();

router.get('/', patientsControllers.getPatients);

router.get('/:id', patientsControllers.getPatient);

router.post('/', patientsControllers.createPatient);

router.put('/:id', patientsControllers.updatePatient);

router.patch('/:id', patientsControllers.deletePatient);

export default router;
