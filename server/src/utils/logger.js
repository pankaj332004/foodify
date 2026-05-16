// Lightweight logger — swap for winston/pino in production

const timestamp = () => new Date().toISOString();

const logger = {
    info: (msg, ...args) => console.log(`[${timestamp()}] INFO:  ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[${timestamp()}] WARN:  ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[${timestamp()}] ERROR: ${msg}`, ...args),
    debug: (msg, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[${timestamp()}] DEBUG: ${msg}`, ...args);
        }
    },
};

export default logger;
