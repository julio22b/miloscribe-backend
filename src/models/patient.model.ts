import { prisma } from '../lib/prisma.js';
import type { Prisma, Patient } from '../../generated/prisma/index.js';

export const createPatient = async (data: Prisma.PatientCreateInput): Promise<Patient> => {
    const createdPatient = await prisma.patient.create({
        data,
    });

    return createdPatient;
};

export const findPatient = async (id: number): Promise<Patient | null> => {
    return prisma.patient.findUnique({ where: { id, deleted_at: null } });
};

export const findPatientWithDetails = async (id: number) => {
    return prisma.patient.findUnique({
        where: { id, deleted_at: null },
        include: {
            consultations: {
                include: { documents: true },
            },
        },
    });
};

export const findPatients = async (doctorId: number): Promise<Patient[]> => {
    const patients = await prisma.patient.findMany({
        where: {
            doctor_id: doctorId,
            deleted_at: null,
        },
        include: {
            consultations: {
                include: { documents: true },
            },
        },
    });

    return patients;
};

export const updatePatientInDB = async (id: number, data: Prisma.PatientUpdateInput): Promise<Patient> => {
    const updatedPatient = await prisma.patient.update({
        where: {
            id,
        },
        data,
    });

    return updatedPatient;
};

export const deletePatientInDB = async (id: number): Promise<Patient> => {
    const deletedPatient = await prisma.patient.update({
        where: {
            id,
        },
        data: {
            deleted_at: new Date(),
        },
    });

    return deletedPatient;
};
