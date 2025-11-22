import { Check, Star, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const plans = [
        {
            name: 'FREE (Trial)',
            description: '7-day free trial to explore all features',
            monthlyPrice: 0,
            yearlyPrice: 0,
            savings: '7 Days Free',
            features: [
                '10 invoices limit',
                '50 customers limit',
                '100 items limit',
                'GST compliant invoicing',
                'Basic customer management',
                'PDF invoice generation',
                'Email support'
            ],
            popular: false,
            cta: 'Start Free Trial'
        },
        {
            name: 'BASIC',
            description: 'Perfect for small businesses',
            monthlyPrice: 499,
            yearlyPrice: 4990,
            savings: 'Save ₹1,000',
            features: [
                '100 invoices/month',
                '200 customers',
                '500 items',
                'GST compliant invoicing',
                'Customer management',
                'Item inventory tracking',
                'PDF generation',
                'Email support',
                'Basic reports'
            ],
            popular: false,
            cta: 'Choose Basic'
        },
        {
            name: 'PROFESSIONAL',
            description: 'Most popular for growing businesses',
            monthlyPrice: 999,
            yearlyPrice: 9990,
            savings: 'Save ₹2,000',
            features: [
                'Unlimited invoices',
                'Unlimited customers',
                'Unlimited items',
                'Advanced GST features',
                'GSTR-1 & GSTR-3B exports',
                'Priority support',
                'Advanced analytics',
                'Payment tracking',
                'Custom templates'
            ],
            popular: true,
            cta: 'Choose Professional'
        },
        {
            name: 'ENTERPRISE',
            description: 'For large businesses with custom needs',
            monthlyPrice: 2499,
            yearlyPrice: 24990,
            savings: 'Save ₹5,000',
            features: [
                'Everything in Professional',
                'Multi-user access',
                'API access',
                'Custom integrations',
                'Dedicated support',
                'Custom workflows',
                'Advanced compliance tools',
                'Training & onboarding',
                'SLA guarantee'
            ],
            popular: false,
            cta: 'Contact Sales'
        }
    ];

    const getPrice = (plan) => {
        return billingCycle === 'monthly' ? plan?.monthlyPrice : plan?.yearlyPrice;
    };

    const getOriginalYearlyPrice = (plan) => {
        return plan?.monthlyPrice * 12;
    };

    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Choose the perfect plan for your business. All plans include GST compliance,
                        professional templates, and customer support.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 relative ${billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Yearly
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                Save 30%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12 sm:mb-16">
                    {plans?.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl border-2 p-6 sm:p-8 ${plan?.popular
                                ? 'border-blue-500 bg-blue-50 md:scale-105' : 'border-gray-200 bg-white hover:border-blue-300'
                                } transition-all duration-300`}
                        >
                            {plan?.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                                        <Star className="h-4 w-4" />
                                        <span>Most Popular</span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {plan?.name}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {plan?.description}
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold text-gray-900">
                                            ₹{getPrice(plan)?.toLocaleString()}
                                        </span>
                                        <span className="text-gray-600 ml-2">
                                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                                        </span>
                                    </div>

                                    {billingCycle === 'yearly' && (
                                        <div className="text-sm">
                                            <span className="text-gray-500 line-through">
                                                ₹{getOriginalYearlyPrice(plan)?.toLocaleString()}/year
                                            </span>
                                            <span className="text-green-600 font-medium ml-2">
                                                {plan?.savings}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan?.features?.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                as={plan?.cta === 'Contact Sales' ? 'button' : Link}
                                to={plan?.cta === 'Contact Sales' ? undefined : '/register'}
                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${plan?.popular
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600'
                                    }`}
                            >
                                {plan?.cta}
                            </Button>

                            {plan?.name === 'Starter' && (
                                <p className="text-center text-sm text-gray-500 mt-3">
                                    14-day free trial • No credit card required
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Feature Comparison */}
                <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Not sure which plan is right for you?
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-4">
                            <Zap className="h-12 w-12 text-blue-600 mx-auto" />
                            <h4 className="font-semibold text-gray-900">Start Small</h4>
                            <p className="text-gray-600">
                                Begin with our Starter plan and upgrade as your business grows.
                                Switch plans anytime with no penalties.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Star className="h-12 w-12 text-blue-600 mx-auto" />
                            <h4 className="font-semibold text-gray-900">Most Choose Professional</h4>
                            <p className="text-gray-600">
                                Get unlimited invoices, advanced features, and priority support.
                                Perfect for most growing businesses.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Check className="h-12 w-12 text-blue-600 mx-auto" />
                            <h4 className="font-semibold text-gray-900">30-Day Guarantee</h4>
                            <p className="text-gray-600">
                                Try any plan risk-free. If you're not completely satisfied,
                                get a full refund within 30 days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;