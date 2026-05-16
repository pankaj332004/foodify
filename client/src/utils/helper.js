/**
 * Truncate a string to given length and append ellipsis
 */
export const truncate = (str, len = 60) =>
    str && str.length > len ? `${str.slice(0, len)}...` : str;

/**
 * Convert minutes to human-readable string
 * e.g. 90 → "1 hr 30 min"
 */
export const formatMinutes = (mins) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
};

/**
 * Get initials from a name for avatar placeholders
 * e.g. "Pankaj Kumar" → "PK"
 */
export const getInitials = (name = '') =>
    name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
