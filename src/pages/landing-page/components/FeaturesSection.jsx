import { BarChart3, Calculator, FileText, Shield, Users, Zap } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: Calculator,
            title: 'Automated GST Calculations',
            description: 'Automatically calculate CGST, SGST, and IGST based on customer location and product categories. Never worry about tax errors again.'
        },
        {
            icon: FileText,
            title: 'Professional Templates',
            description: 'Choose from beautiful, customizable invoice templates that reflect your brand identity and maintain professional standards.'
        },
        {
            icon: Users,
            title: 'Customer Management',
            description: 'Organize customer information, track payment history, and maintain detailed records for better relationship management.'
        },
        {
            icon: BarChart3,
            title: 'Compliance Reporting',
            description: 'Generate GSTR-1, GSTR-3B reports instantly. Stay compliant with Indian tax regulations effortlessly.'
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Bank-grade security with automatic backups. Your business data is always safe and accessible when you need it.'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Create invoices in under 30 seconds. Send them instantly via email or WhatsApp to your customers.'
        }
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Everything You Need to Manage Invoices
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Powerful features designed specifically for Indian businesses to handle
                        GST compliance, customer management, and professional invoicing.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features?.map((feature, index) => {
                        const IconComponent = feature?.icon;
                        return (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                                        <IconComponent className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature?.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {feature?.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-full font-medium">
                        <span>And many more features to explore</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;