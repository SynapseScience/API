import cors from "cors";

export default function () {
    return cors({
        origin: 'https://synapse-api.replit.app',
        methods: ['GET', 'POST'],
        credentials: true,
    });
}