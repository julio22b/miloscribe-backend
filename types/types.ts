import type { Request } from 'express';

interface AuthenticatedRequest<T = any> extends Request<object, any, T> {
    doctor?: { id: number };
}

interface CreateConsultationBody {
    patientId: string;
}

export type { AuthenticatedRequest, CreateConsultationBody };
