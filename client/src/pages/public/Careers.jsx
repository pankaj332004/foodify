import React from 'react';

const Careers = () => {
    return (
        <div className="container mx-auto px-8 py-16 animate-float-up">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-heading font-extrabold text-primary mb-8 border-b-2 border-primary-200 pb-4">
                    Join the Foodify Team
                </h1>

                <div className="mb-12">
                    <p className="text-xl text-gray-600 italic border-l-4 border-secondary-dark pl-6 my-8">
                        "We're not just delivering food; we're building the infrastructure for the future of urban commerce."
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        At Foodify, we're looking for passionate individuals who are excited about technology, logistics, and, of course, delicious food. Whether you're a developer, a designer, or a logistics expert, there's a place for you here.
                    </p>
                </div>

                <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">Open Positions</h2>
                <div className="space-y-4 mb-16">
                    {[
                        { title: 'Senior Software Engineer (Frontend)', location: 'Remote / NYC', type: 'Full-time' },
                        { title: 'Product Designer', location: 'London / Remote', type: 'Full-time' },
                        { title: 'Operations Manager', location: 'Mumbai', type: 'Full-time' },
                        { title: 'Delivery Fleet Lead', location: 'San Francisco', type: 'Contract' },
                    ].map((job, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="text-sm text-gray-500 flex gap-4 mt-1">
                                        <span>📍 {job.location}</span>
                                        <span>💼 {job.type}</span>
                                    </div>
                                </div>
                                <div className="text-primary-light group-hover:text-primary transition-transform group-hover:translate-x-1">
                                    ➡️
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-primary-50 rounded-2xl p-10 text-center">
                    <h2 className="text-2xl font-heading font-bold text-primary-dark mb-4">Don't see the right role?</h2>
                    <p className="text-gray-600 mb-6">We're always looking for talented people. Send us your resume and we'll keep you in mind for future openings.</p>
                    <button className="btn-brand max-w-xs mx-auto">Send General Application</button>
                </div>
            </div>
        </div>
    );
};

export default Careers;
