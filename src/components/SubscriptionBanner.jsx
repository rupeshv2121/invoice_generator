import { AlertCircle, Clock, Crown, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionBanner = () => {
    const navigate = useNavigate();
    const {
        subscription,
        isTrialActive,
        isTrialExpiring,
        hasTrialExpired,
        getDaysRemaining,
        getRemainingInvoices,
        getSubscriptionPlan,
    } = useSubscription();

    const [dismissed, setDismissed] = useState(false);

    if (!subscription || dismissed) return null;

    const daysLeft = getDaysRemaining();
    const invoicesLeft = getRemainingInvoices();
    const plan = getSubscriptionPlan();

    // Trial Active - Show warning if expiring soon
    if (isTrialActive() && isTrialExpiring()) {
        return (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <Clock className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-orange-900 text-lg">
                                ⚠️ Trial Ending Soon!
                            </h3>
                            <p className="text-orange-700 mt-1 text-sm">
                                Your free trial ends in <span className="font-bold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>.
                                {invoicesLeft !== Infinity && (
                                    <> You have <span className="font-bold">{invoicesLeft} invoice{invoicesLeft !== 1 ? 's' : ''}</span> remaining.</>
                                )}
                            </p>
                            <p className="text-orange-600 mt-2 text-sm">
                                Upgrade now to continue using all features without interruption.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/pricing')}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium shadow-md flex items-center gap-2"
                        >
                            <Crown className="w-4 h-4" />
                            Upgrade Now
                        </button>
                        <button
                            onClick={() => setDismissed(true)}
                            className="text-orange-400 hover:text-orange-600 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Trial Active - Normal state
    if (isTrialActive()) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <Zap className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-indigo-900 text-lg">
                                🎉 Free Trial Active
                            </h3>
                            <p className="text-indigo-700 mt-1 text-sm">
                                You have <span className="font-bold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span> remaining in your trial.
                                {invoicesLeft !== Infinity && (
                                    <> Create up to <span className="font-bold">{invoicesLeft} more invoice{invoicesLeft !== 1 ? 's' : ''}</span>.</>
                                )}
                            </p>
                            <p className="text-indigo-600 mt-1 text-sm">
                                Enjoying the app? Upgrade anytime to unlock unlimited features.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/pricing')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md"
                        >
                            View Plans
                        </button>
                        <button
                            onClick={() => setDismissed(true)}
                            className="text-indigo-400 hover:text-indigo-600 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Trial Expired
    if (hasTrialExpired()) {
        return (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 text-lg">
                                Trial Expired
                            </h3>
                            <p className="text-red-700 mt-1 text-sm">
                                Your free trial has ended. Subscribe to a plan to continue creating invoices.
                            </p>
                            <p className="text-red-600 mt-2 text-sm font-medium">
                                Choose a plan that fits your business needs.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold shadow-md whitespace-nowrap"
                    >
                        Subscribe Now
                    </button>
                </div>
            </div>
        );
    }

    // Invoice Limit Warning (for active subscriptions)
    if (invoicesLeft !== Infinity && invoicesLeft < 10 && subscription.isActive) {
        return (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-amber-900 text-lg">
                                Invoice Limit Warning
                            </h3>
                            <p className="text-amber-700 mt-1 text-sm">
                                You have <span className="font-bold">{invoicesLeft} invoice{invoicesLeft !== 1 ? 's' : ''}</span> remaining this month on your <span className="font-semibold">{plan}</span> plan.
                            </p>
                            <p className="text-amber-600 mt-1 text-sm">
                                Upgrade to get unlimited invoices and more features.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/pricing')}
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium shadow-md"
                        >
                            Upgrade Plan
                        </button>
                        <button
                            onClick={() => setDismissed(true)}
                            className="text-amber-400 hover:text-amber-600 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SubscriptionBanner;
