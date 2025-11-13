import { createContext, useContext, useEffect, useState } from 'react';
import { useSubscriptionService } from '../api/subscription';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const { getCurrentSubscription } = useSubscriptionService();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const data = await getCurrentSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = () => {
    return subscription?.isActive === true;
  };

  const canCreateInvoice = () => {
    if (!subscription) return false;
    if (!subscription.isActive) return false;
    if (subscription.invoiceLimit === -1) return true;
    return subscription.invoicesUsed < subscription.invoiceLimit;
  };

  const getRemainingInvoices = () => {
    if (!subscription) return 0;
    if (subscription.invoiceLimit === -1) return Infinity;
    return Math.max(0, subscription.invoiceLimit - subscription.invoicesUsed);
  };

  const getDaysRemaining = () => {
    return subscription?.daysRemaining || 0;
  };

  const getSubscriptionPlan = () => {
    return subscription?.plan || 'FREE';
  };

  const getSubscriptionStatus = () => {
    return subscription?.status || 'none';
  };

  const isTrialActive = () => {
    return subscription?.status === 'TRIAL' && subscription?.isActive;
  };

  const isTrialExpiring = () => {
    if (!isTrialActive()) return false;
    const daysLeft = getDaysRemaining();
    return daysLeft <= 2 && daysLeft > 0;
  };

  const hasTrialExpired = () => {
    return subscription?.status === 'TRIAL' && !subscription?.isActive;
  };

  const isSubscriptionExpired = () => {
    return subscription?.status === 'EXPIRED';
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        hasActiveSubscription,
        canCreateInvoice,
        getRemainingInvoices,
        getDaysRemaining,
        getSubscriptionPlan,
        getSubscriptionStatus,
        isTrialActive,
        isTrialExpiring,
        hasTrialExpired,
        isSubscriptionExpired,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
