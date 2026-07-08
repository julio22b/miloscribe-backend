import { type Response } from 'express';
import type { Prisma } from '../../generated/prisma/index.js';
import { findDoctorById } from '../models/doctor.model.js';
import {
    createPatient as createPatientInDB,
    deletePatientInDB,
    findPatient,
    findPatientWithDetails,
    findPatients,
    updatePatientInDB,
} from '../models/patient.model.js';
import type { AuthenticatedRequest } from '../types/types.js';
import { isOwnedByDoctor } from '../lib/authorization.js';

const getPatients = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const patients = await findPatients(req.doctor!.id);

        res.status(200).json({ patients });
    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const getPatient = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        const patient = await findPatientWithDetails(id);

        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }

        if (!isOwnedByDoctor(res, patient.doctor_id, req.doctor!.id)) {
            return;
        }

        res.status(200).json({ patient });
    } catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updatePatient = async (req: AuthenticatedRequest<Prisma.PatientUpdateInput>, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, date_of_birth, gender } = req.body;

        if (!name || !date_of_birth || !gender) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        const patient = await findPatient(id);

        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }

        if (!isOwnedByDoctor(res, patient.doctor_id, req.doctor!.id)) {
            return;
        }

        const updatedPatient = await updatePatientInDB(id, { name, date_of_birth: new Date(date_of_birth as string), gender });
        res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deletePatient = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        const patient = await findPatient(id);

        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }

        if (!isOwnedByDoctor(res, patient.doctor_id, req.doctor!.id)) {
            return;
        }

        const deletedPatient = await deletePatientInDB(id);
        res.status(200).json({ message: 'Patient deleted successfully', patient: deletedPatient });
    } catch (error) {
        console.error('Delete patient error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const createPatient = async (req: AuthenticatedRequest<Prisma.PatientCreateInput>, res: Response) => {
    try {
        const { name, date_of_birth, gender } = req.body;

        const doctorId = req.doctor?.id;

        if (!name || !date_of_birth || !gender || !doctorId) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const doctor = await findDoctorById(doctorId);

        const patient = await createPatientInDB({
            name,
            date_of_birth: new Date(date_of_birth),
            gender,
            doctor: {
                connect: { id: doctor!.id },
            },
        });

        res.status(201).json({ message: 'Patient created successfully', patient });
    } catch (error) {
        res.status(500).json({ error, message: 'Something went wrong' });
    }
};

export default { createPatient, getPatients, getPatient, updatePatient, deletePatient };
