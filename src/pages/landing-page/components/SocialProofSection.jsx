import { Quote, Star } from 'lucide-react';

const SocialProofSection = () => {
    const testimonials = [
        {
            name: 'Rajesh Kumar',
            role: 'Small Business Owner',
            company: 'Kumar Electronics',
            image: '/public/assets/images/no_image.png',
            rating: 5,
            text: 'InvoicePro has transformed how we handle GST invoicing. The automated calculations save us hours every week, and compliance reporting is now effortless.'
        },
        {
            name: 'Priya Sharma',
            role: 'Freelance Consultant',
            company: 'Sharma Consulting',
            image: '/public/assets/images/no_image.png',
            rating: 5,
            text: 'As a freelancer, I needed professional invoices that comply with GST rules. InvoicePro makes it so simple - I can create and send invoices in minutes.'
        },
        {
            name: 'Amit Patel',
            role: 'Retail Store Owner',
            company: 'Patel Traders',
            image: '/public/assets/images/no_image.png',
            rating: 5,
            text: 'The customer management features are excellent. I can track all payments and maintain detailed records. GST filing has never been this easy!'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Active Businesses' },
        { value: '500K+', label: 'Invoices Generated' },
        { value: '99.9%', label: 'GST Compliance Rate' },
        { value: '4.9/5', label: 'Customer Rating' }
    ];

    const trustedBy = [
        'Small Businesses',
        'Freelancers',
        'Retailers',
        'Service Providers',
        'Consultants',
        'Manufacturers'
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                        Trusted by Thousands of Indian Businesses
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {stats?.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                                    {stat?.value}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat?.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trusted By */}
                    <div className="mb-16">
                        <p className="text-gray-600 mb-6">Trusted by various business types:</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {trustedBy?.map((type, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 font-medium"
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials?.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 relative"
                        >
                            <Quote className="h-8 w-8 text-blue-200 mb-4" />

                            <div className="mb-6">
                                <div className="flex items-center mb-2">
                                    {[...Array(testimonial?.rating || 5)]?.map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 text-yellow-400 fill-current"
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    "{testimonial?.text}"
                                </p>
                            </div>

                            <div className="flex items-center">
                                <img
                                    src={testimonial?.image}
                                    alt={testimonial?.name}
                                    className="w-12 h-12 rounded-full bg-gray-200 mr-4"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {testimonial?.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {testimonial?.role}
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        {testimonial?.company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center space-x-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">99.9% Uptime</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Bank-Grade Security</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;