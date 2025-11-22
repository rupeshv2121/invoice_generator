import { useEffect, useState } from 'react';
import { useInvoiceService } from '../../../api/invoice';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerHistoryModal = ({ isOpen, onClose, customer }) => {
    const [activeTab, setActiveTab] = useState('invoices');
    const [invoiceHistory, setInvoiceHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getInvoices } = useInvoiceService();

    // Fetch invoices for this customer
    useEffect(() => {
        const fetchCustomerInvoices = async () => {
            if (!customer?.id || !isOpen) return;

            setLoading(true);
            try {
                const allInvoices = await getInvoices();
                console.log('All invoices:', allInvoices);
                console.log('Customer object:', customer);
                console.log('Customer ID:', customer.id, 'Type:', typeof customer.id);

                // Filter invoices for this specific customer
                // Check both strict and loose equality to handle string/number mismatch
                const customerInvoices = allInvoices.filter(inv => {
                    console.log('Invoice customerId:', inv.customerId, 'Type:', typeof inv.customerId, 'Matches:', inv.customerId == customer.id);
                    return inv.customerId == customer.id; // Use == for loose comparison
                });

                console.log('Filtered customer invoices:', customerInvoices);
                setInvoiceHistory(customerInvoices);
            } catch (error) {
                console.error('Error fetching customer invoices:', error);
                setInvoiceHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerInvoices();
    }, [customer?.id, isOpen]);

    // Calculate payment history from invoices (paid invoices)
    const paymentHistory = invoiceHistory
        .filter(inv => inv.status?.toLowerCase() === 'paid')
        .map(inv => ({
            id: `PAY-${inv.invoiceNumber}`,
            date: inv.invoiceDate,
            amount: inv.grandTotal || 0,
            method: inv.paymentMethod || 'Bank Transfer',
            invoiceId: inv.invoiceNumber,
            status: 'Completed'
        }));

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': case 'completed':
                return 'bg-green-600 text-white';
            case 'overdue':
                return 'bg-red-600 text-white';
            case 'draft':
                return 'bg-yellow-600 text-white';
            default:
                return 'bg-muted text-text-secondary';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString)?.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '₹0';
        }
        return `₹${Number(amount).toLocaleString('en-IN')}`;
    };

    // Calculate totals from real invoice data
    const totalInvoiced = invoiceHistory?.reduce((sum, invoice) => sum + (invoice?.grandTotal || 0), 0);
    const totalPaid = invoiceHistory
        ?.filter(inv => inv.status?.toLowerCase() === 'paid')
        ?.reduce((sum, invoice) => sum + (invoice?.grandTotal || 0), 0);
    const totalOutstanding = invoiceHistory
        ?.filter(inv => inv.status?.toLowerCase() === 'pending' || inv.status?.toLowerCase() === 'overdue')
        ?.reduce((sum, invoice) => sum + (invoice?.grandTotal || 0), 0);

    console.log('Invoice History:', invoiceHistory);
    console.log('Total Invoiced:', totalInvoiced);
    console.log('Total Paid:', totalPaid);
    console.log('Total Outstanding:', totalOutstanding);

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg border border-border w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">{customer?.businessName}</h2>
                        <p className="text-text-secondary">Customer History & Analytics</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        iconName="X"
                        iconSize={20}
                    >
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="p-6 border-b border-border">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-surface rounded-lg p-4 border border-border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        </div>
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Invoiced</p>
                                        <p className="text-xl font-bold text-foreground">{formatAmount(totalInvoiced)}</p>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Icon name="FileText" size={20} className="text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Paid</p>
                                        <p className="text-xl font-bold text-green-600">{formatAmount(totalPaid)}</p>
                                    </div>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Icon name="CheckCircle" size={20} className="text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Outstanding</p>
                                        <p className="text-xl font-bold text-yellow-600">{formatAmount(totalOutstanding)}</p>
                                    </div>
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Icon name="Clock" size={20} className="text-yellow-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-text-secondary">Total Invoices</p>
                                        <p className="text-xl font-bold text-foreground">{invoiceHistory?.length}</p>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Icon name="Receipt" size={20} className="text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                    <div className="flex space-x-0">
                        <button
                            onClick={() => setActiveTab('invoices')}
                            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                                }`}
                        >
                            <Icon name="FileText" size={16} />
                            <span>Invoice History</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'payments' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                                }`}
                        >
                            <Icon name="CreditCard" size={16} />
                            <span>Payment History</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
                            <div className="hidden lg:block space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center space-x-4 p-4 bg-surface rounded-lg border border-border">
                                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:hidden space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-surface rounded-lg p-4 border border-border space-y-3">
                                        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : activeTab === 'invoices' ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground mb-4">Invoice History</h3>

                            {invoiceHistory.length === 0 ? (
                                <div className="text-center py-12 text-text-secondary">
                                    <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No invoices found for this customer</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden lg:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="text-left p-4 font-medium text-foreground">Invoice ID</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Date</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Items</th>
                                                    <th className="text-right p-4 font-medium text-foreground">Amount</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Due Date</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoiceHistory?.map((invoice, index) => (
                                                    <tr
                                                        key={invoice?.id}
                                                        className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-secondary'
                                                            }`}
                                                    >
                                                        <td className="p-4 font-medium text-foreground">{invoice?.invoiceNumber}</td>
                                                        <td className="p-4 text-foreground">{formatDate(invoice?.invoiceDate)}</td>
                                                        <td className="p-4 text-foreground">{invoice?.items?.length || 0} items</td>
                                                        <td className="p-4 text-right font-medium text-foreground">{formatAmount(invoice?.grandTotal)}</td>
                                                        <td className="p-4 text-foreground">{formatDate(invoice?.dueDate)}</td>
                                                        <td className="p-4">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                                                                {invoice?.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="lg:hidden space-y-4">
                                        {invoiceHistory?.map((invoice) => (
                                            <div key={invoice?.id} className="bg-surface border border-border rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-foreground">{invoice?.invoiceNumber}</h4>
                                                        <p className="text-sm text-text-secondary">{formatDate(invoice?.invoiceDate)}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                                                        {invoice?.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm text-foreground">{invoice?.items?.length || 0} items</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-text-secondary">Amount:</span>
                                                        <span className="font-medium text-foreground">{formatAmount(invoice?.grandTotal)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-text-secondary">Due Date:</span>
                                                        <span className="text-sm text-foreground">{formatDate(invoice?.dueDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground mb-4">Payment History</h3>

                            {paymentHistory.length === 0 ? (
                                <div className="text-center py-12 text-text-secondary">
                                    <Icon name="CreditCard" size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No payment records found for this customer</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden lg:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="text-left p-4 font-medium text-foreground">Payment ID</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Date</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Invoice ID</th>
                                                    <th className="text-right p-4 font-medium text-foreground">Amount</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Method</th>
                                                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paymentHistory?.map((payment, index) => (
                                                    <tr
                                                        key={payment?.id}
                                                        className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-secondary'
                                                            }`}
                                                    >
                                                        <td className="p-4 font-medium text-foreground">{payment?.id}</td>
                                                        <td className="p-4 text-foreground">{formatDate(payment?.date)}</td>
                                                        <td className="p-4 text-foreground">{payment?.invoiceId}</td>
                                                        <td className="p-4 text-right font-medium text-foreground">{formatAmount(payment?.amount)}</td>
                                                        <td className="p-4 text-foreground">{payment?.method}</td>
                                                        <td className="p-4">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment?.status)}`}>
                                                                {payment?.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="lg:hidden space-y-4">
                                        {paymentHistory?.map((payment) => (
                                            <div key={payment?.id} className="bg-surface border border-border rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-foreground">{payment?.id}</h4>
                                                        <p className="text-sm text-text-secondary">{formatDate(payment?.date)}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment?.status)}`}>
                                                        {payment?.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-text-secondary">Invoice:</span>
                                                        <span className="text-sm text-foreground">{payment?.invoiceId}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-text-secondary">Amount:</span>
                                                        <span className="font-medium text-foreground">{formatAmount(payment?.amount)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-text-secondary">Method:</span>
                                                        <span className="text-sm text-foreground">{payment?.method}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-border">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerHistoryModal;