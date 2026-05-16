import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        // Join user-specific room (for targeted notifications)
        socket.on('join:user', (userId) => {
            socket.join(`user:${userId}`);
        });

        // Join restaurant room (for order notifications)
        socket.on('join:restaurant', (restaurantId) => {
            socket.join(`restaurant:${restaurantId}`);
        });

        // Join order room (customer + delivery partner track same order)
        socket.on('join:order', (orderId) => {
            socket.join(`order:${orderId}`);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Call getIO() anywhere in the app to emit events
export const getIO = () => {
    if (!io) throw new Error('Socket.io not initialized. Call initSocket first.');
    return io;
};
