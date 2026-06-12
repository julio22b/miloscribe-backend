import express, { type Request, type Response, type Application, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello World! Your TypeScript Express server is running.');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Error. Check logs.');
});

app.listen(PORT, (): void => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
