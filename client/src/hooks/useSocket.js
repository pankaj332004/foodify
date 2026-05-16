import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../config/socketConfig';
import useAuth from './useAuth';

/**
 * Connects to Socket.io when authenticated.
 * Joins user-specific room on connect.
 * Returns the socket instance for event binding.
 */
const useSocket = () => {
    const { user, isAuthenticated } = useAuth();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const socket = connectSocket();
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join:user', user._id);
        });

        return () => {
            disconnectSocket();
        };
    }, [isAuthenticated, user]);

    return getSocket();
};

export default useSocket;
