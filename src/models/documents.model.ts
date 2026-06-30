import { Prisma } from 'generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';

export const createDocument = async (data: Prisma.DocumentCreateInput) => {
    const createdDocument = await prisma.document.create({
        data,
    });

    return createdDocument;
};

export const patchDocumentContent = async (content: string, id: number) => {
    const updatedDocument = await prisma.document.update({ where: { id }, data: { content } });

    return updatedDocument;
};

export const searchDocumentById = async (id: number) => {
    const document = await prisma.document.findUnique({
        where: { id },
        include: { consultation: { include: { patient: true } } },
    });

    return document;
};

export const removeDocument = async (id: number) => {
    const removedDocument = await prisma.document.delete({
        where: { id },
    });

    return removedDocument;
};

export const searchDocumentsByConsultationId = async (consultationId: number) => {
    return prisma.document.findMany({
        where: { consultation_id: consultationId },
    });
};
