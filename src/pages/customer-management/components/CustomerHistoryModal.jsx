import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerHistoryModal = ({ isOpen, onClose, customer }) => {
    const [activeTab, setActiveTab] = useState('invoices');

    // Mock transaction history data
    const invoiceHistory = [
        {
            id: 'INV-2024-001',
            date: '2024-09-25',
            amount: 125000,
            status: 'Paid',
            dueDate: '2024-10-25',
            items: 'Web Development Services'
        },
        {
            id: 'INV-2024-002',
            date: '2024-09-20',
            amount: 85000,
            status: 'Overdue',
            dueDate: '2024-10-20',
            items: 'UI/UX Design Services'
        },
        {
            id: 'INV-2024-003',
            date: '2024-09-15',
            amount: 95000,
            status: 'Paid',
            dueDate: '2024-10-15',
            items: 'Mobile App Development'
        },
        {
            id: 'INV-2024-004',
            date: '2024-09-10',
            amount: 75000,
            status: 'Draft',
            dueDate: '2024-10-10',
            items: 'Consulting Services'
        }
    ];

    const paymentHistory = [
        {
            id: 'PAY-001',
            date: '2024-09-26',
            amount: 125000,
            method: 'Bank Transfer',
            invoiceId: 'INV-2024-001',
            status: 'Completed'
        },
        {
            id: 'PAY-002',
            date: '2024-09-16',
            amount: 95000,
            method: 'UPI',
            invoiceId: 'INV-2024-003',
            status: 'Completed'
        }
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': case 'completed':
                return 'bg-success/10 text-success';
            case 'overdue':
                return 'bg-destructive/10 text-destructive';
            case 'draft':
                return 'bg-warning/10 text-warning';
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
        return `₹${amount?.toLocaleString('en-IN')}`;
    };

    const totalInvoiced = invoiceHistory?.reduce((sum, invoice) => sum + invoice?.amount, 0);
    const totalPaid = paymentHistory?.reduce((sum, payment) => sum + payment?.amount, 0);
    const totalOutstanding = totalInvoiced - totalPaid;

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg border border-border w-full max-w-6xl max-h-[90vh] overflow-hidden">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-surface rounded-lg p-4 border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary">Total Invoiced</p>
                                    <p className="text-xl font-bold text-foreground">{formatAmount(totalInvoiced)}</p>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Icon name="FileText" size={20} className="text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface rounded-lg p-4 border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary">Total Paid</p>
                                    <p className="text-xl font-bold text-success">{formatAmount(totalPaid)}</p>
                                </div>
                                <div className="p-2 bg-success/10 rounded-lg">
                                    <Icon name="CheckCircle" size={20} className="text-success" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface rounded-lg p-4 border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary">Outstanding</p>
                                    <p className="text-xl font-bold text-warning">{formatAmount(totalOutstanding)}</p>
                                </div>
                                <div className="p-2 bg-warning/10 rounded-lg">
                                    <Icon name="Clock" size={20} className="text-warning" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface rounded-lg p-4 border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary">Total Invoices</p>
                                    <p className="text-xl font-bold text-foreground">{invoiceHistory?.length}</p>
                                </div>
                                <div className="p-2 bg-secondary/10 rounded-lg">
                                    <Icon name="Receipt" size={20} className="text-secondary" />
                                </div>
                            </div>
                        </div>
                    </div>
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
                    {activeTab === 'invoices' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground mb-4">Invoice History</h3>

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
                                                <td className="p-4 font-medium text-foreground">{invoice?.id}</td>
                                                <td className="p-4 text-foreground">{formatDate(invoice?.date)}</td>
                                                <td className="p-4 text-foreground">{invoice?.items}</td>
                                                <td className="p-4 text-right font-medium text-foreground">{formatAmount(invoice?.amount)}</td>
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
                                                <h4 className="font-medium text-foreground">{invoice?.id}</h4>
                                                <p className="text-sm text-text-secondary">{formatDate(invoice?.date)}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                                                {invoice?.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm text-foreground">{invoice?.items}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-text-secondary">Amount:</span>
                                                <span className="font-medium text-foreground">{formatAmount(invoice?.amount)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-text-secondary">Due Date:</span>
                                                <span className="text-sm text-foreground">{formatDate(invoice?.dueDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground mb-4">Payment History</h3>

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

                            {paymentHistory?.length === 0 && (
                                <div className="text-center py-12">
                                    <Icon name="CreditCard" size={48} className="mx-auto text-text-secondary mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">No payment history</h3>
                                    <p className="text-text-secondary">No payments have been recorded for this customer yet.</p>
                                </div>
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