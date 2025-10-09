import { ArrowRight, CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const keyBenefits = [
        'GST Compliant Invoicing',
        'Automated Tax Calculations',
        'Professional Templates',
        'Real-time Reports'
    ];

    return (
        <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                GST Compliant for Indian Businesses
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Create Professional
                                <span className="text-blue-600 block">GST Invoices</span>
                                in Minutes
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                Streamline your invoicing process with automated GST calculations,
                                professional templates, and comprehensive compliance reporting.
                                Perfect for Indian businesses of all sizes.
                            </p>
                        </div>

                        {/* Key Benefits */}
                        <div className="grid grid-cols-2 gap-4">
                            {keyBenefits?.map((benefit, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                as={Link}
                                to="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1 rounded-lg font-semibold text-lg flex items-center justify-center group transition-all duration-200"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center group transition-all duration-200">
                                <Play className="mr-2 h-5 w-5" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-8 pt-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">10,000+</div>
                                <div className="text-sm text-gray-600">Happy Businesses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">500K+</div>
                                <div className="text-sm text-gray-600">Invoices Generated</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                                <div className="text-sm text-gray-600">GST Compliance</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Hero Image/Mockup */}
                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-blue-200 rounded w-1/4"></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-3 bg-green-200 rounded w-1/5"></div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-blue-800">GST Total</span>
                                        <span className="text-lg font-bold text-blue-900">₹1,800</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                            ✓ GST Compliant
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Auto Calculate
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;