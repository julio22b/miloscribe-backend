import type { Response } from 'express';

const isOwnedByDoctor = (res: Response, ownerDoctorId: number, requestingDoctorId: number): boolean => {
    if (ownerDoctorId !== requestingDoctorId) {
        res.status(403).json({ error: 'Forbidden' });
        return false;
    }

    return true;
};

export { isOwnedByDoctor };
