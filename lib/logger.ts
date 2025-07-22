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
        new transports.Console(),
        new LokiCloudTransport({
            
            host: process.env.LOKI_HOST!,
            user: process.env.LOKI_USER !,
            apiKey: process.env.LOKI_API_KEY!,

            labels: {
                app: 'text-review',
                env: env
            },

        })
    ]
});

// No Loki transport other than in production
if (env !== 'production')
  logger.remove(logger.transports[1]);

export default logger;