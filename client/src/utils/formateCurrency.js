import appConfig from '../config/appConfig';

/**
 * Format a number as USD currency string
 * e.g. formatCurrency(199) → "$199"
 */
export const formatCurrency = (amount) => {
    return `${appConfig.currencySymbol}${Number(amount).toFixed(2)}`;
};
