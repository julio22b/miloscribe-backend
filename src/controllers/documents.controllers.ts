import type { AuthenticatedRequest, UpdateDocumentBody } from '../types/types.js';
import { Response } from 'express';
import {
    patchDocumentContent,
    removeDocument,
    searchDocumentById,
    searchDocumentsByConsultationId,
} from '../models/documents.model.js';
import { changeConsultationStatus, searchConsultationById } from '../models/consultation.model.js';
import { isOwnedByDoctor } from '../lib/authorization.js';

const updateDocument = async (req: AuthenticatedRequest<UpdateDocumentBody>, res: Response) => {
    try {
        const { content } = req.body;
        const id = Number(req.params.id);

        const document = await searchDocumentById(id);

        if (!document) {
            res.status(400).json({ error: 'Document does not exist' });
            return;
        }

        if (!isOwnedByDoctor(res, document.consultation.patient.doctor_id, req.doctor!.id)) {
            return;
        }

        const updatedDocument = await patchDocumentContent(content, id);

        res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
    } catch (error) {
        console.error('Update document error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        const document = await searchDocumentById(id);

        if (!document) {
            res.status(400).json({ error: 'Document does not exist' });
            return;
        }

        if (!isOwnedByDoctor(res, document.consultation.patient.doctor_id, req.doctor!.id)) {
            return;
        }

        await removeDocument(id);

        const remainingDocuments = await searchDocumentsByConsultationId(document.consultation_id);

        const updatedConsultation =
            remainingDocuments.length === 0
                ? await changeConsultationStatus('PENDING', document.consultation_id)
                : await searchConsultationById(document.consultation_id);

        res.status(200).json({ message: 'Document deleted successfully', consultation: updatedConsultation });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export { updateDocument, deleteDocument };
