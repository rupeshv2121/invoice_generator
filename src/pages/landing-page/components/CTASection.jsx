import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const CTASection = () => {
    const urgencyPoints = [
        'Join 10,000+ businesses already using InvoicePro',
        '14-day free trial with full access to all features',
        'Setup takes less than 5 minutes',
        'No credit card required to start'
    ];

    const quickStats = [
        { icon: Zap, value: '30 sec', label: 'Invoice Creation' },
        { icon: CheckCircle, value: '99.9%', label: 'GST Compliance' },
        { icon: Users, value: '10K+', label: 'Happy Customers' }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center space-y-12">
                    {/* Main CTA */}
                    <div className="space-y-6">
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Ready to Transform Your
                            <span className="block text-yellow-300">Invoicing Process?</span>
                        </h2>

                        <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                            Join thousands of Indian businesses who have already simplified their
                            GST invoicing with InvoicePro. Start your free trial today.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
                        {quickStats?.map((stat, index) => {
                            const IconComponent = stat?.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-3">
                                        <IconComponent className="h-8 w-8 text-yellow-300" />
                                    </div>
                                    <div className="text-2xl lg:text-3xl font-bold text-white">
                                        {stat?.value}
                                    </div>
                                    <div className="text-blue-200 font-medium">
                                        {stat?.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            as={Link}
                            to="/register"
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center group transition-all duration-200 shadow-2xl"
                        >
                            Start Your Free Trial
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Button
                            as={Link}
                            to="/login"
                            className="border-2 border-white/30 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                        >
                            Sign In to Your Account
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {urgencyPoints?.map((point, index) => (
                                <div key={index} className="flex items-center space-x-2 text-blue-100">
                                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                                    <span className="text-sm font-medium">{point}</span>
                                </div>
                            ))}
                        </div>

                        <div className="inline-flex items-center space-x-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-blue-100">SSL Secured</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="text-sm text-blue-100">GDPR Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span className="text-sm text-blue-100">24/7 Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm max-w-4xl mx-auto">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center items-center space-x-1">
                                {[...Array(5)]?.map((_, i) => (
                                    <div key={i} className="w-6 h-6 text-yellow-400 fill-current">
                                        ⭐
                                    </div>
                                ))}
                            </div>
                            <blockquote className="text-lg italic text-blue-100">
                                "InvoicePro has completely transformed how we handle our GST invoicing.
                                What used to take hours now takes minutes!"
                            </blockquote>
                            <div className="text-white font-semibold">
                                - Rajesh Kumar, Kumar Electronics
                            </div>
                        </div>
                    </div>

                    {/* Final Urgency */}
                    <div className="text-center">
                        <p className="text-blue-200 text-lg">
                            Don't let manual invoicing hold your business back.
                        </p>
                        <p className="text-white font-semibold text-xl">
                            Start automating your GST invoices today!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;