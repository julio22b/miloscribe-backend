import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    let decoded: string | jwt.JwtPayload;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    req.doctor = decoded;

    next();
};
