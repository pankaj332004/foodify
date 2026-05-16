import React from 'react';

const Blog = () => {
    const posts = [
        {
            title: 'The Best Sushi Spots in Tokyo',
            excerpt: 'Discover the hidden gems of the Tsukiji Outer Market and beyond, where tradition meets modern culinary art.',
            author: 'Emi Sato',
            date: 'May 12, 2024',
            tag: 'Foodie Guide',
            image: '/blog/sushi.png'
        },
        {
            title: 'How We Reduced Delivery Times by 15%',
            excerpt: 'A deep dive into our new route optimization algorithm that uses AI to predict traffic and weather patterns.',
            author: 'Alex Chen',
            date: 'May 08, 2024',
            tag: 'Engineering',
            image: '/blog/delivery.png'
        },
        {
            title: 'Summer Recipes: Refreshing Salads',
            excerpt: 'Quick and easy salads to keep you cool this summer. These recipes use fresh, seasonal ingredients you can find at any market.',
            author: 'Chef Marco',
            date: 'May 03, 2024',
            tag: 'Recipes',
            image: '/blog/salad.png'
        }
    ];

    return (
        <div className="container mx-auto px-8 py-16 animate-float-up">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl font-heading font-extrabold text-gray-900 mb-4">
                        Foodify <span className="text-primary">Blog</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Insights, recipes, and stories from the heart of the culinary world.
                    </p>
                    <div className="mt-8 flex justify-center gap-2">
                        {['All', 'Foodie Guide', 'Engineering', 'Recipes', 'News'].map(t => (
                            <button key={t} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${t === 'All' ? 'bg-primary text-white shadow-primary-sm' : 'bg-white text-gray-500 hover:bg-primary-50 hover:text-primary border border-gray-100'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {posts.map((post, idx) => (
                        <article key={idx} className="food-card overflow-hidden flex flex-col hover:-translate-y-3 transition-all duration-500 group">
                            <div className="relative aspect-16/10 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-md text-primary font-bold text-[0.7rem] uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                        {post.tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 grow flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                    {post.title}
                                </h2>
                                <p className="text-gray-500 text-[0.95rem] mb-8 grow line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-50 pt-6 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-xs">
                                            {post.author[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-xs">{post.author}</span>
                                            <span className="text-[0.65rem] text-gray-400 font-medium">{post.date}</span>
                                        </div>
                                    </div>
                                    <button className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        Read More <span>→</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-20 bg-primary-50 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <h2 className="text-3xl font-heading font-extrabold text-primary-dark mb-4">Subscribe to our newsletter</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto font-medium">Get the latest stories and recipes delivered directly to your inbox every week.</p>
                    <div className="max-w-md mx-auto flex gap-3">
                        <input type="email" placeholder="Enter your email" className="input-brand" />
                        <button className="btn-brand whitespace-nowrap px-8">Join Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
