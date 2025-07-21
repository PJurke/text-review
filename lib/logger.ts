import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

const env = process.env.NODE_ENV || 'development';

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new LokiTransport({
            host: process.env.LOKI_HOST || '',

            labels: {
                app: 'text-review',
                env: env
            },
            json: true,
            
            basicAuth: `${process.env.LOKI_USERNAME}:${process.env.LOKI_API_KEY}`,

            onConnectionError: (err) => console.error(err),
        })
    ]
});

// No Loki transport other than in production
if (env !== 'production')
  logger.remove(logger.transports[1]);

export default logger;