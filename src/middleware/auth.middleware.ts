import { type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedRequest } from '../types/types.js';

export const authenticationMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof decoded === 'string' || !('id' in decoded) || typeof decoded.id !== 'number') {
            res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
            return;
        }

        req.doctor = { id: decoded.id };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Unauthorized: Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
        } else {
            console.error('Authentication error:', error);
            res.status(500).json({ error: 'Something went wrong during authentication' });
        }
    }
};
