import React from 'react';

const TermsOfService = () => {
    return (
        <div className="container mx-auto px-8 py-16 animate-float-up">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-heading font-extrabold text-primary mb-8 border-b-2 border-primary-200 pb-4">
                    Terms of Service
                </h1>
                <div className="prose prose-orange max-w-none text-gray-700 leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                        <p>By using the Foodify platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Orders and Payments</h2>
                        <p>All orders are subject to availability. You agree to pay the total amount for your order, including any delivery fees and taxes.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cancellation Policy</h2>
                        <p>Orders can only be cancelled before they've been accepted by the restaurant. Refund eligibility depends on the timing of the cancellation.</p>
                    </section>

                    <div className="bg-gray-50 p-6 rounded-xl text-sm border-l-4 border-primary">
                        <p className="font-bold mb-2">Legal Jurisdiction</p>
                        <p>These terms are governed by the laws of the jurisdiction in which Foodify operates.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
