import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-8 py-16 animate-float-up">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-heading font-extrabold text-primary mb-8 border-b-2 border-primary-200 pb-4">
                    About Foodify
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Welcome to <strong>Foodify</strong>, where we believe that great food should be accessible to everyone, everywhere. Our mission is to connect local restaurants with hungry customers through a seamless, delightful experience.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Founded in 2024, Foodify has quickly grown from a small startup to a leading food delivery platform. We pride ourselves on our lightning-fast delivery, curated selection of premium restaurants, and our commitment to supporting local businesses.
                        </p>
                    </div>
                    <div className="food-card p-4 shadow-primary-md rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-primary-50 rounded-xl aspect-video flex items-center justify-center text-6xl">
                            🍔🍕🍣
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-card mb-16">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6 text-center">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-3xl mb-3">🚀</div>
                            <h3 className="font-bold mb-2">Speed</h3>
                            <p className="text-sm text-gray-500">Hot food delivered to your door in minutes, not hours.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-3">🧡</div>
                            <h3 className="font-bold mb-2">Quality</h3>
                            <p className="text-sm text-gray-500">Only the best restaurants make it onto our platform.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-3">🌍</div>
                            <h3 className="font-bold mb-2">Community</h3>
                            <p className="text-sm text-gray-500">Empowering local chefs and supporting small businesses.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Hungry?</h2>
                    <p className="text-gray-500 mb-8">Join thousands of happy customers and order your favorite meal today.</p>
                    <a href="/" className="btn-brand inline-block max-w-xs mx-auto">Start Ordering Now</a>
                </div>
            </div>
        </div>
    );
};

export default About;
