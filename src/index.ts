import express, { type Request, type Response, type Application, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';

dotenv.config();

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const origin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(express.json());
app.use(
    cors({
        origin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);

app.use('/auth', authRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
        return;
    }

    console.error(err.stack);
    res.status(500).send('Error. Check logs.');
});

app.listen(PORT, (): void => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
