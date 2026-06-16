import { prisma } from '../../lib/prisma.js';
import type { Consultation, Prisma } from '../generated/prisma/index.js';

export const createConsultation = async (data: Prisma.ConsultationCreateInput): Promise<Consultation> => {
    const consultation = await prisma.consultation.create({
        data,
    });

    return consultation;
};
