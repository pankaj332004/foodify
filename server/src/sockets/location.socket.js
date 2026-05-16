import { getIO } from '../config/socket.js';
import DeliveryPartner from '../models/DeliveryPartner.js';

/**
 * Registers location-related socket events.
 * Call once after initSocket().
 *
 * Events handled:
 *  - location:update  → delivery partner broadcasts their live GPS position
 *  - location:request → customer requests the current position of their delivery
 */
export const registerLocationSocket = () => {
    const io = getIO();

    io.on('connection', (socket) => {
        /**
         * Delivery partner emits this as they move.
         * Payload: { partnerId: string, lat: number, lng: number, orderId: string }
         */
        socket.on('location:update', async ({ partnerId, lat, lng, orderId }) => {
            try {
                // Persist latest position to DB (fire-and-forget)
                DeliveryPartner.findByIdAndUpdate(partnerId, {
                    currentLocation: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                }).exec();

                // Broadcast to everyone tracking this order
                if (orderId) {
                    io.to(`order:${orderId}`).emit('location:partnerMoved', {
                        orderId,
                        lat,
                        lng,
                        timestamp: Date.now(),
                    });
                }
            } catch (err) {
                console.error('location:update error', err.message);
            }
        });

        /**
         * Customer requests the latest known position of their delivery partner.
         * Payload: { partnerId: string }
         */
        socket.on('location:request', async ({ partnerId }) => {
            try {
                const partner = await DeliveryPartner.findById(partnerId).select('currentLocation');
                if (partner) {
                    const [lng, lat] = partner.currentLocation.coordinates;
                    socket.emit('location:current', { lat, lng });
                }
            } catch (err) {
                console.error('location:request error', err.message);
            }
        });
    });
};
