import { createLogger, format, transports } from 'winston';
import LokiCloudTransport from './logging/loki-transport';

const env = process.env.NODE_ENV || 'development';

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console()
    ]
});

export function initializeLokiTransport(): void {

    if (env === 'production' && process.env.LOKI_HOST && process.env.LOKI_USERNAME && process.env.LOKI_API_KEY) {

        logger.add(new LokiCloudTransport({
            host: process.env.LOKI_HOST,
            user: process.env.LOKI_USERNAME,
            apiKey: process.env.LOKI_API_KEY,
            labels: {
                app: 'text-review',
                env: env
            },
        }));

        logger.info('Loki transport initialized.');

    }

}

export default logger;