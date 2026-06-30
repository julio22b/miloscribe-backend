import type { Request } from 'express';
import { DocumentType } from 'generated/prisma/index.js';

interface AuthenticatedRequest<T = object> extends Request<{ id?: string }, object, T> {
    doctor?: { id: number };
}

interface CreateConsultationBody {
    patientId: string;
}

interface ProcessConsultationBody {
    consultationId: string;
    documentType: DocumentType;
}

interface UpdateDocumentBody {
    content: string;
}

export type { AuthenticatedRequest, CreateConsultationBody, ProcessConsultationBody, UpdateDocumentBody };
