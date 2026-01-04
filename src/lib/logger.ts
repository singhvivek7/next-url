import pino from 'pino';

// Create logger instance with appropriate configuration
const logger = pino({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

    // Pretty print in development
    transport: process.env.NODE_ENV !== 'production' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false,
        }
    } : undefined,

    // Base configuration
    base: {
        env: process.env.NODE_ENV,
    },

    // Timestamp
    timestamp: pino.stdTimeFunctions.isoTime,

    // Serializers for common objects
    serializers: {
        err: pino.stdSerializers.err,
        error: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
    },
});

// Create child loggers for different modules
export const createLogger = (module: string) => {
    return logger.child({ module });
};

// Default export
export default logger;

// Convenience methods for common logging patterns
export const loggers = {
    analytics: createLogger('analytics'),
    api: createLogger('api'),
    auth: createLogger('auth'),
    database: createLogger('database'),
    payment: createLogger('payment'),
    cron: createLogger('cron'),
};
