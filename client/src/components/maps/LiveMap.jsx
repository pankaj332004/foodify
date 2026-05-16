import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (emoji, color) => {
    return L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">${emoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });
};

const restaurantIcon = createCustomIcon('🏪', '#f97316'); // Orange
const deliveryIcon = createCustomIcon('🛵', '#3b82f6'); // Blue
const customerIcon = createCustomIcon('🏠', '#10b981'); // Green

// Helper component to adjust map bounds to fit all markers
const MapBoundsFitter = ({ restaurantLocation, deliveryLocation, customerLocation }) => {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds();

        if (restaurantLocation?.lat && restaurantLocation?.lng) {
            bounds.extend([restaurantLocation.lat, restaurantLocation.lng]);
        }
        if (deliveryLocation?.lat && deliveryLocation?.lng) {
            bounds.extend([deliveryLocation.lat, deliveryLocation.lng]);
        }
        if (customerLocation?.lat && customerLocation?.lng) {
            bounds.extend([customerLocation.lat, customerLocation.lng]);
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
    }, [map, restaurantLocation, deliveryLocation, customerLocation]);

    return null;
};

// Main LiveMap Component
const LiveMap = ({ order, currentStep }) => {
    // Basic validation to ensure we have some coordinates
    const hasCoordinates =
        (order?.restaurant?.address?.coordinates?.length === 2) ||
        (order?.deliveryPartner?.location?.coordinates?.length === 2);

    if (!hasCoordinates) {
        return (
            <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-6 text-center border-2 border-dashed border-gray-200">
                <MapPin className="w-12 h-12 mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">Map data unavailable</p>
                <p className="text-sm mt-1">Waiting for location updates...</p>
            </div>
        );
    }

    // Extract coordinates safely
    // MongoDB stores coordinates as [longitude, latitude]
    const restCoords = order.restaurant?.address?.coordinates;
    const restaurantLocation = restCoords?.length === 2
        ? { lat: restCoords[1], lng: restCoords[0] }
        : null;

    const delCoords = order.deliveryPartner?.location?.coordinates;
    const deliveryLocation = delCoords?.length === 2
        ? { lat: delCoords[1], lng: delCoords[0] }
        : null;

    // Fallback Customer location if no real coordinates exist (often just an address string in this app)
    // In a real app, this would be geocoded beforehand. For demo, we might offset it slightly from restaurant.
    const customerLocation = order.deliveryAddress?.coordinates?.length === 2
        ? { lat: order.deliveryAddress.coordinates[1], lng: order.deliveryAddress.coordinates[0] }
        // Mock customer location slightly offset from restaurant if we dont have it.
        : restaurantLocation ? { lat: restaurantLocation.lat + 0.01, lng: restaurantLocation.lng + 0.01 } : null;

    // Determine initial center
    const center = deliveryLocation || restaurantLocation || customerLocation || { lat: 0, lng: 0 };


    return (
        <div className="w-full h-full min-h-[350px] relative rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-0">
            {/* Status Badge overlay */}
            <div className="absolute top-4 left-4 z-400 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-gray-800">
                    {currentStep === 2 ? 'Driver on the way' : currentStep === 3 ? 'Delivered' : 'Tracking Active'}
                </span>
            </div>

            <MapContainer
                center={[center.lat, center.lng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false} // Disable default to move it or hide it
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <MapBoundsFitter
                    restaurantLocation={restaurantLocation}
                    deliveryLocation={deliveryLocation}
                    customerLocation={customerLocation}
                />

                {/* Restaurant Marker */}
                {restaurantLocation && (
                    <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
                        <Popup className="custom-popup">
                            <div className="font-bold">{order.restaurant?.name || 'Restaurant'}</div>
                            <div className="text-xs text-gray-500">Pickup Location</div>
                        </Popup>
                    </Marker>
                )}

                {/* Customer Marker */}
                {customerLocation && (
                    <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
                        <Popup className="custom-popup">
                            <div className="font-bold">Delivery Location</div>
                            <div className="text-xs text-gray-500">{order.deliveryAddress?.street}</div>
                        </Popup>
                    </Marker>
                )}

                {/* Delivery Partner Marker (Show only if assigned/out for delivery) */}
                {deliveryLocation && (currentStep >= 2) && (
                    <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}>
                        <Popup className="custom-popup">
                            <div className="font-bold">{order.deliveryPartner?.user?.name || 'Driver'}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Navigation className="w-3 h-3" /> Arriving soon
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LiveMap;
