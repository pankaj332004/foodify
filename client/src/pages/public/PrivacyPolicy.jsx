import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto px-8 py-16 animate-float-up">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-heading font-extrabold text-primary mb-8 border-b-2 border-primary-200 pb-4">
                    Privacy Policy
                </h1>
                <div className="prose prose-orange max-w-none text-gray-700 leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We collect information that you provides directly to us, such as when you create an account, place an order, or participate in our promotions.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Contact Information (Name, Email, Phone Number)</li>
                            <li>Delivery Address</li>
                            <li>Payment Information (processed securely by our partners)</li>
                            <li>Order History and Preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, including processing transactions and sending notifications.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Sharing</h2>
                        <p>We do not sell your personal data. We only share information with restaurants and delivery partners as necessary to fulfill your orders.</p>
                    </section>

                    <div className="bg-gray-50 p-6 rounded-xl text-sm border-l-4 border-primary">
                        <p className="font-bold mb-2">Last Updated: March 2024</p>
                        <p>This policy is subject to change. We will notify you of any significant updates via email or app notification.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
