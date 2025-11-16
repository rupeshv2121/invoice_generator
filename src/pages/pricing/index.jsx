import { Check, Crown, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSubscriptionService } from '../../api/subscription';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Header from '../../components/ui/Header';
import { useAuth } from '../../context/AuthContext';

const Pricing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getAllPlans } = useSubscriptionService();

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await getAllPlans();
            setPlans(data);
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (planName) => {
        if (planName === 'FREE') {
            navigate('/dashboard');
            return;
        }

        // For now, just show an alert
        toast.info(`Payment integration coming soon! Selected plan: ${planName}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Header />
            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb />

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Choose Your Plan
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Start with a 7-day free trial. No credit card required.
                        </p>
                        {!user && (
                            <p className="text-sm text-indigo-600 mt-3">
                                Already have an account?{' '}
                                <a href="/login" className="font-semibold underline hover:text-indigo-700">
                                    Sign in
                                </a>
                            </p>
                        )}
                    </div>

                    {/* Plans Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {plans.map((plan, index) => {
                            const isProfessional = plan.name === 'PROFESSIONAL';

                            return (
                                <div
                                    key={plan.name}
                                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${isProfessional ? 'ring-2 ring-indigo-600 transform scale-105 lg:scale-110' : ''
                                        }`}
                                >
                                    {/* Popular Badge */}
                                    {isProfessional && (
                                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Crown className="w-4 h-4" />
                                                <span className="text-sm font-semibold">Most Popular</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold text-gray-900">
                                                    ₹{plan.price}
                                                </span>
                                                <span className="text-gray-600">/month</span>
                                            </div>
                                            {plan.name === 'FREE' && (
                                                <p className="text-sm text-gray-500 mt-1">7-day trial</p>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-3 mb-6 min-h-[240px]">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <button
                                            onClick={() => handleSelectPlan(plan.name)}
                                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isProfessional
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                }`}
                                        >
                                            {plan.name === 'FREE' ? (
                                                <>
                                                    <Zap className="w-4 h-4" />
                                                    Start Free Trial
                                                </>
                                            ) : (
                                                <>
                                                    <Crown className="w-4 h-4" />
                                                    Get Started
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 text-center">
                        <p className="text-sm text-gray-600 mb-4">Trusted by 1000+ businesses</p>
                        <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>Cancel Anytime</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>24/7 Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>No Hidden Fees</span>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    What happens after my trial ends?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    You'll need to choose a paid plan to continue using the service. Your data is safe and will be waiting for you when you upgrade.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Can I change plans later?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Is my data secure?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Absolutely! We use bank-level encryption and security measures to protect your data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Pricing;
