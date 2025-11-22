import { AlertTriangle, CheckCircle, Clock, Shield, TrendingUp, Users } from 'lucide-react';

const BenefitsSection = () => {
    const painPoints = [
        {
            icon: AlertTriangle,
            problem: 'Manual GST Calculations',
            solution: 'Automated tax calculations with 100% accuracy',
            description: 'Stop worrying about GST errors. Our system automatically calculates the correct tax amounts based on your business location and customer details.'
        },
        {
            icon: Clock,
            problem: 'Time-Consuming Invoice Creation',
            solution: 'Create invoices in under 30 seconds',
            description: 'Pre-filled templates and customer data mean you can generate professional invoices instantly, saving hours of manual work every week.'
        },
        {
            icon: Shield,
            problem: 'Compliance Headaches',
            solution: 'Always stay GST compliant',
            description: 'Built-in compliance checks ensure your invoices meet all Indian tax regulations. Generate reports for GSTR filing with one click.'
        },
        {
            icon: Users,
            problem: 'Customer Data Scattered',
            solution: 'Centralized customer management',
            description: 'Keep all customer information, payment history, and communication in one place for better business relationships.'
        }
    ];

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Increase Revenue',
            description: 'Faster invoicing means faster payments. Professional invoices improve your business credibility and payment collection rates.'
        },
        {
            icon: Clock,
            title: 'Save Time Daily',
            description: 'Automate repetitive tasks and focus on growing your business instead of paperwork. Save up to 5 hours per week on invoicing.'
        },
        {
            icon: CheckCircle,
            title: 'Error-Free Operations',
            description: 'Eliminate calculation mistakes and compliance errors. Built-in validation ensures accuracy in every invoice.'
        }
    ];

    return (
        <section id="benefits" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Transform Your Invoicing Process
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Say goodbye to manual invoicing headaches and hello to automated,
                        professional, GST-compliant business operations.
                    </p>
                </div>

                {/* Pain Points & Solutions */}
                <div className="space-y-6 sm:space-y-8 lg:space-y-12 mb-12 sm:mb-16 lg:mb-20">
                    {painPoints?.map((item, index) => {
                        const IconComponent = item?.icon;
                        return (
                            <div
                                key={index}
                                className={`flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Content */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-100">
                                            <IconComponent className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-red-600 font-medium uppercase tracking-wide">
                                                Problem
                                            </div>
                                            <div className="text-xl font-semibold text-gray-900">
                                                {item?.problem}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-4 border-green-500 pl-6">
                                        <div className="text-sm text-green-600 font-medium uppercase tracking-wide mb-2">
                                            Our Solution
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {item?.solution}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            {item?.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Visual */}
                                <div className="flex-1">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                                        <div className="bg-white p-6 rounded-xl shadow-sm">
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-px bg-gray-200 my-4"></div>
                                                <div className="flex justify-between items-center">
                                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                                    <div className="h-6 bg-green-500 rounded w-1/4 flex items-center justify-center">
                                                        <CheckCircle className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Key Benefits */}
                <div className="grid md:grid-cols-3 gap-8">
                    {benefits?.map((benefit, index) => {
                        const IconComponent = benefit?.icon;
                        return (
                            <div
                                key={index}
                                className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-6">
                                    <IconComponent className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {benefit?.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit?.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;