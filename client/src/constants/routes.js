export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',

    // Public
    RESTAURANT_DETAILS: '/restaurants/:id',
    SEARCH: '/search',

    // User
    USER_DASHBOARD: '/dashboard',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_HISTORY: '/orders',
    ORDER_TRACKING: '/orders/:id/track',

    // Restaurant owner
    RESTAURANT_DASHBOARD: '/restaurant/dashboard',
    RESTAURANT_MENU: '/restaurant/menu',
    RESTAURANT_ORDERS: '/restaurant/orders',

    // Delivery
    DELIVERY_DASHBOARD: '/delivery/dashboard',
    DELIVERY_ACTIVE: '/delivery/active',

    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_RESTAURANTS: '/admin/restaurants',
    ADMIN_USERS: '/admin/users',

    // Informational
    ABOUT: '/about',
    CAREERS: '/careers',
    BLOG: '/blog',
    HELP: '/help',
    PRIVACY: '/privacy',
    TERMS: '/terms',
};
