/**
 * Haversine formula — calculates the straight-line distance
 * between two geo-coordinates.
 *
 * @param {number} lat1 - latitude of point A
 * @param {number} lon1 - longitude of point A
 * @param {number} lat2 - latitude of point B
 * @param {number} lon2 - longitude of point B
 * @returns {number} distance in kilometres
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // 1 decimal place
};

const toRad = (deg) => (deg * Math.PI) / 180;

export const estimateDeliveryTime = (distanceKm) => {
    const AVG_SPEED_KMH = 25; // city average
    const PREP_TIME_MIN = 15;
    const travelTime = (distanceKm / AVG_SPEED_KMH) * 60;
    return Math.ceil(PREP_TIME_MIN + travelTime);
};

/**
 * Estimate distance based on pincode difference.
 * For 6-digit Indian pincodes, a difference of ~10 pincode units ≈ 5km.
 * This is a rough but consistent heuristic for same-city vs cross-city checks.
 * @param {string} pin1
 * @param {string} pin2
 * @returns {number} estimated kilometres
 */
export const calculateDistanceByPincode = (pin1, pin2) => {
    const p1 = parseInt(pin1.toString().replace(/\D/g, ''));
    const p2 = parseInt(pin2.toString().replace(/\D/g, ''));
    if (isNaN(p1) || isNaN(p2)) return 5; // Default fallback

    const diff = Math.abs(p1 - p2);
    if (diff === 0) return 1.5; // Same pincode area — assumed nearby

    // Heuristic: every 2 pincode units ≈ 1km (tuned for Indian 6-digit pincodes)
    // Cap at 100km max to avoid cross-state inflated numbers
    const estimated = Math.min(diff / 2, 100);
    return Math.max(2, Math.round(estimated * 10) / 10);
};
