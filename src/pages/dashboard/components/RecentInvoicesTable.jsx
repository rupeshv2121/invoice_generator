import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const RecentInvoicesTable = ({ invoices }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-600 text-white';
            case 'pending':
                return 'bg-yellow-500 text-white';
            case 'overdue':
                return 'bg-red-600 text-white';
            case 'draft':
                return 'bg-gray-300 text-gray-600';
            default:
                return 'bg-gray-300 text-gray-600';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString)?.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        })?.format(amount);
    };

    return (
        <div className="bg-card border border-border rounded-lg invoice-shadow-sm">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Invoices</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/invoice-list')}
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="text-sm"
                >
                    <span className="hidden sm:inline">View All</span>
                    <span className="sm:hidden">All</span>
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="text-left py-3 px-6 text-sm font-medium text-text-secondary">Invoice No.</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-text-secondary">Customer</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-text-secondary">Amount</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-text-secondary">Due Date</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-text-secondary">Status</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-text-secondary">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices?.map((invoice, index) => (
                            <tr key={invoice?.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-secondary'}>
                                <td className="py-4 px-6 text-sm font-medium text-foreground">
                                    {invoice?.invoiceNumber}
                                </td>
                                <td className="py-4 px-6 text-sm text-foreground">
                                    {invoice?.customerName}
                                </td>
                                <td className="py-4 px-6 text-sm font-medium text-foreground">
                                    {formatCurrency(invoice?.amount)}
                                </td>
                                <td className="py-4 px-6 text-sm text-foreground">
                                    {formatDate(invoice?.dueDate)}
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                                        {invoice?.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            iconName="Eye"
                                            onClick={() => navigate(`/invoice-list?view=${invoice?.id}`)}
                                        >
                                            <span className="sr-only">View Invoice</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            iconName="Download"
                                            onClick={() => {/* Handle download */ }}
                                        >
                                            <span className="sr-only">Download Invoice</span>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
                {invoices?.map((invoice) => (
                    <div key={invoice?.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="font-mono text-sm font-medium text-primary">
                                    {invoice?.invoiceNumber}
                                </div>
                                <div className="text-sm text-text-secondary">
                                    {formatDate(invoice?.dueDate)}
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                                {invoice?.status}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <div className="font-medium text-foreground">{invoice?.customerName}</div>
                                <div className="font-medium text-foreground">
                                    {formatCurrency(invoice?.amount)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                iconName="Eye"
                                onClick={() => navigate(`/invoice-list?view=${invoice?.id}`)}
                                className="flex-1"
                            >
                                View
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                iconName="Download"
                                onClick={() => {/* Handle download */ }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentInvoicesTable;