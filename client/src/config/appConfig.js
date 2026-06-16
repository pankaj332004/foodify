const appConfig = {
    appName: 'Foodify',
    version: '1.0.0',
    defaultDeliveryFee: 2.00,
    taxRate: 0.05, // 5%
    currency: 'USD',
    currencySymbol: '$',

    // ── UPI / Scan & Pay ────────────────────────────────────────────────
    // Replace these with your real UPI details
    upi: {
        id: 'pk902124@okhdfcbank',          // 👈 Replace with your UPI ID (e.g. 9876543210@paytm)
        name: 'Foodify Payments',     // 👈 Name shown in payment apps
        description: 'Foodify Order Payment',
    },
};

export default appConfig;
