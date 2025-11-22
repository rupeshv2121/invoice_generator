import { BarChart3, Calculator, FileText, Shield, Users, Zap } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: Calculator,
            title: 'Automated GST Calculations',
            description: 'Automatic CGST, SGST, and IGST calculations based on customer state. Supports intra-state and inter-state GST with real-time tax computation.'
        },
        {
            icon: FileText,
            title: 'Professional PDF Invoices',
            description: 'Generate GST-compliant A4 invoices with jsPDF. Includes company logo, bank details, HSN codes, and complete tax breakdowns.'
        },
        {
            icon: Users,
            title: 'Customer & Item Management',
            description: 'Complete CRM with customer profiles, purchase history, GSTIN validation. Inventory tracking with HSN/SAC codes and bulk CSV import.'
        },
        {
            icon: BarChart3,
            title: 'Reports & Analytics',
            description: 'Real-time dashboard with revenue trends, payment reminders, GST summaries. Export GSTR-1 and GSTR-3B ready data in CSV/Excel/PDF.'
        },
        {
            icon: Shield,
            title: 'Subscription Plans',
            description: '7-day free trial with tiered plans (FREE/BASIC/PROFESSIONAL/ENTERPRISE). Usage tracking with automatic limit enforcement and renewal reminders.'
        },
        {
            icon: Zap,
            title: 'Modern Tech Stack',
            description: 'Built with React 18, Vite, Tailwind CSS, Supabase Auth, Express REST API, Prisma ORM, and PostgreSQL for blazing-fast performance.'
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {features?.map((feature, index) => {
                        const IconComponent = feature?.icon;
                        return (
                            <div
                                key={index}
                                className="group p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="mb-4 sm:mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                                        <IconComponent className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                </div>

                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                    {feature?.title}
                                </h3>

                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {feature?.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12 sm:mt-16 px-4">
                    <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-50 text-blue-700 rounded-full font-medium text-sm sm:text-base">
                        <span>And many more features to explore</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;