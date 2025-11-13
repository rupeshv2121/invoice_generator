import { Calendar, CheckCircle, Crown, FileText, Package, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionStatusCard = () => {
    const navigate = useNavigate();
    const {
        subscription,
        loading,
        getDaysRemaining,
        getRemainingInvoices,
        getSubscriptionPlan,
        getSubscriptionStatus,
        isTrialActive,
    } = useSubscription();

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="text-center">
                    <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm mb-4">No active subscription</p>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                        View Plans
                    </button>
                </div>
            </div>
        );
    }

    const plan = getSubscriptionPlan();
    const status = getSubscriptionStatus();
    const daysLeft = getDaysRemaining();
    const invoicesLeft = getRemainingInvoices();
    const isTrial = isTrialActive();

    // Plan colors
    const planColors = {
        FREE: 'bg-gray-100 text-gray-800 border-gray-300',
        BASIC: 'bg-blue-100 text-blue-800 border-blue-300',
        PROFESSIONAL: 'bg-purple-100 text-purple-800 border-purple-300',
        ENTERPRISE: 'bg-amber-100 text-amber-800 border-amber-300',
    };

    const statusColors = {
        TRIAL: 'bg-blue-500',
        ACTIVE: 'bg-green-500',
        EXPIRED: 'bg-red-500',
        CANCELLED: 'bg-gray-500',
        SUSPENDED: 'bg-orange-500',
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Your Plan</h3>
                    <Crown className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${planColors[plan]}`}>
                        {plan}
                    </span>
                    {isTrial && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                            Trial
                        </span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                            {status.toLowerCase()}
                        </span>
                    </div>
                </div>

                {/* Days Remaining */}
                {(isTrial || subscription.endDate) && (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">
                                {isTrial ? 'Trial ends in' : 'Renews in'}
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                )}

                {/* Invoices Remaining */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="bg-green-50 p-2 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Invoices</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {invoicesLeft === Infinity ? (
                                <>
                                    <span className="text-green-600">Unlimited</span>
                                    <CheckCircle className="w-4 h-4 text-green-600 inline ml-1" />
                                </>
                            ) : (
                                <>
                                    {invoicesLeft} / {subscription.invoiceLimit}
                                    <span className="text-xs text-gray-500 ml-1">remaining</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Usage Stats */}
                {invoicesLeft !== Infinity && (
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">Usage this month</span>
                            <span className="text-xs font-medium text-gray-900">
                                {subscription.invoicesUsed} / {subscription.invoiceLimit}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${(subscription.invoicesUsed / subscription.invoiceLimit) * 100 > 80
                                        ? 'bg-red-500'
                                        : (subscription.invoicesUsed / subscription.invoiceLimit) * 100 > 50
                                            ? 'bg-orange-500'
                                            : 'bg-green-500'
                                    }`}
                                style={{
                                    width: `${Math.min((subscription.invoicesUsed / subscription.invoiceLimit) * 100, 100)}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Limits Summary */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Customers</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {subscription.customersLimit === -1 ? '∞' : subscription.customersLimit}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <Package className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Items</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {subscription.itemsLimit === -1 ? '∞' : subscription.itemsLimit}
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => navigate('/pricing')}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                    <Crown className="w-4 h-4" />
                    {isTrial ? 'Upgrade to Premium' : 'Change Plan'}
                </button>
            </div>
        </div>
    );
};

export default SubscriptionStatusCard;
