import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { initSocket } from './src/config/socket.js';
import { registerLocationSocket } from './src/sockets/location.socket.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // 1. Connect to database
    await connectDB();

    // 2. Create HTTP server from Express app
    const httpServer = http.createServer(app);

    // 3. Attach Socket.io
    initSocket(httpServer);

    // 4. Register socket event handlers
    registerLocationSocket();

    // 5. Start listening
    httpServer.listen(PORT, () => {
        logger.info(`🚀 Foodify server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
        logger.info(`📡 WebSocket ready`);
        logger.info(`🔗 API: http://localhost:${PORT}/api/health`);
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        logger.error(`Unhandled Rejection: ${err.message}`);
        httpServer.close(() => process.exit(1));
    });
};

startServer();
