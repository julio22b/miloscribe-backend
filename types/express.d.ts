export {};

declare global {
    namespace Express {
        interface Request {
            doctor?: { id: number };
        }
    }
}
