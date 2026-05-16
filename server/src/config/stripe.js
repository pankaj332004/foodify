// NOTE: Run `npm install stripe` to enable Stripe payments.
// Then add STRIPE_SECRET_KEY to your .env file.

let stripe = null;

try {
    const Stripe = (await import('stripe')).default;
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
    });
    console.log('✅ Stripe initialized');
} catch {
    console.warn('⚠️  Stripe not installed. Run: npm install stripe');
}

export default stripe;
