import React from 'react';

const HelpCenter = () => {
    return (
        <div className="container mx-auto px-8 py-16 animate-float-up">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-heading font-extrabold text-primary mb-8 border-b-2 border-primary-200 pb-4">
                    Help Center
                </h1>

                <div className="bg-white rounded-2xl p-10 shadow-card mb-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">How can we help you today?</h2>
                    <div className="relative max-w-xl mx-auto">
                        <input type="text" placeholder="Search for articles..." className="input-brand pr-12" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {[
                        { title: 'Orders & Deliveries', icon: '📦' },
                        { title: 'Payments & Refunds', icon: '💳' },
                        { title: 'Account Settings', icon: '👤' },
                        { title: 'Foodify for Business', icon: '💼' }
                    ].map((cat, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-primary-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="text-4xl mb-4">{cat.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{cat.title}</h3>
                            <ul className="space-y-2 text-primary-dark font-medium text-sm">
                                <li className="hover:underline">Common Questions →</li>
                                <li className="hover:underline">Troubleshooting →</li>
                                <li className="hover:underline">Policy details →</li>
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="text-center bg-brand-bg rounded-2xl p-12 border-2 border-dashed border-primary-200">
                    <h2 className="text-xl font-bold mb-4">Still need help?</h2>
                    <p className="text-gray-500 mb-8">Out support team is available 24/7 via live chat or email.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button className="btn-brand md:w-auto px-8">Live Chat</button>
                        <button className="btn-brand md:w-auto px-8 bg-none border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">Email Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
