/**
 * Global Error Handler Middleware
 *
 * Must be registered LAST in app.js after all routes:
 *   app.use(errorHandler);
 *
 * All thrown errors and next(err) calls land here.
 */

// ─── Custom App Error class ──────────────────────────────────────────────────
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;  // distinguish from unexpected bugs
        Error.captureStackTrace(this, this.constructor);
    }
}

// ─── 404 — Not Found handler (place before errorHandler in app.js) ───────────
export const notFound = (req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// ─── Main error handler ──────────────────────────────────────────────────────
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose — invalid ObjectId (CastError)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose — duplicate key (unique constraint violation)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    }

    // Mongoose — validation errors
    if (err.name === 'ValidationError') {
        statusCode = 422;
        console.error('\n🔴 [MONGOOSE VALIDATION ERROR]', err.errors);
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
    }

    // JWT errors (backup — also handled in auth middleware)
    if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token.'; }
    if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired.'; }

    // Multer errors
    if (err.name === 'MulterError') {
        statusCode = 400;
        message = err.message;
    }

    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err,
        }),
    };

    res.status(statusCode).json(response);
};
