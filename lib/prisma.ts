import { PrismaClient } from "@prisma/client";
import logger from "./logger";

type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
}

const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
    ]
});

// Listen for the ‘info’ event. Connection pool information is logged here.
prisma.$on('info', (e: LogEvent) => {
    logger.info(`[Prisma] ${e.message}`, { 
        target: e.target,
        timestamp: e.timestamp 
    });
});

// Listen for ‘warn’ events
prisma.$on('warn', (e: LogEvent) => {
    logger.warn(`[Prisma] ${e.message}`, {
        target: e.target,
        timestamp: e.timestamp 
    });
});

// Listen for ‘error’ events to catch connection errors
prisma.$on('error', (e: LogEvent) => {
    logger.error(`[Prisma] ${e.message}`, {
        target: e.target,
        timestamp: e.timestamp 
    });
});

export default prisma;