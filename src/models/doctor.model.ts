import { prisma } from '../lib/prisma.js';
import type { Prisma, Doctor } from '../../generated/prisma/index.js';

export const findDoctorByUsername = async (username: string): Promise<Doctor | null> => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            username,
        },
    });

    return doctor;
};

export const findDoctorById = async (id: number): Promise<Doctor | null> => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
        },
    });

    return doctor;
};

export const createDoctor = async (data: Prisma.DoctorCreateInput): Promise<Doctor> => {
    const doctor = await prisma.doctor.create({
        data,
    });

    return doctor;
};

export const deleteDoctorAndData = async (id: number): Promise<void> => {
    // Hard wipe
    // TODO: adding onDelete: Cascade to the three FK relations in the schema
    // (Doctor→Patient, Patient→Consultation, Consultation→Document) would reduce
    // this to a single prisma.doctor.delete call. Safe to add because soft-deletes
    // use prisma.patient.update (not delete), so cascades would not affect them.
    await prisma.$transaction([
        prisma.document.deleteMany({ where: { consultation: { patient: { doctor_id: id } } } }),
        prisma.consultation.deleteMany({ where: { patient: { doctor_id: id } } }),
        prisma.patient.deleteMany({ where: { doctor_id: id } }),
        prisma.doctor.delete({ where: { id } }),
    ]);
};
