import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerAnalysis = () => {
    const topCustomers = [
        {
            id: 1,
            name: "Rajesh Enterprises Pvt Ltd",
            totalInvoices: 45,
            totalAmount: 1245000,
            paidAmount: 1100000,
            pendingAmount: 145000,
            lastPayment: "15/10/2024",
            status: "good"
        },
        {
            id: 2,
            name: "Mumbai Trading Company",
            totalInvoices: 32,
            totalAmount: 890000,
            paidAmount: 890000,
            pendingAmount: 0,
            lastPayment: "28/10/2024",
            status: "excellent"
        },
        {
            id: 3,
            name: "Delhi Manufacturing Ltd",
            totalInvoices: 28,
            totalAmount: 756000,
            paidAmount: 600000,
            pendingAmount: 156000,
            lastPayment: "05/10/2024",
            status: "average"
        },
        {
            id: 4,
            name: "Chennai Exports Inc",
            totalInvoices: 23,
            totalAmount: 645000,
            paidAmount: 445000,
            pendingAmount: 200000,
            lastPayment: "20/09/2024",
            status: "poor"
        },
        {
            id: 5,
            name: "Bangalore Tech Solutions",
            totalInvoices: 19,
            totalAmount: 534000,
            paidAmount: 534000,
            pendingAmount: 0,
            lastPayment: "30/10/2024",
            status: "excellent"
        }
    ];

    const agingAnalysis = [
        { range: "0-30 days", amount: 245000, count: 12, percentage: 35 },
        { range: "31-60 days", amount: 189000, count: 8, percentage: 27 },
        { range: "61-90 days", amount: 156000, count: 6, percentage: 22 },
        { range: "90+ days", amount: 110000, count: 4, percentage: 16 }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })?.format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent': return 'text-success bg-success/10';
            case 'good': return 'text-primary bg-primary/10';
            case 'average': return 'text-warning bg-warning/10';
            case 'poor': return 'text-destructive bg-destructive/10';
            default: return 'text-text-secondary bg-muted';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'excellent': return 'TrendingUp';
            case 'good': return 'CheckCircle';
            case 'average': return 'Minus';
            case 'poor': return 'TrendingDown';
            default: return 'Circle';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Top Customers */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">Top Customers</h2>
                    <Button variant="outline" size="sm" iconName="Download" className="w-full sm:w-auto">
                        Export Customer Report
                    </Button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-medium text-text-secondary">Customer</th>
                                <th className="text-right py-3 px-4 font-medium text-text-secondary">Invoices</th>
                                <th className="text-right py-3 px-4 font-medium text-text-secondary">Total Amount</th>
                                <th className="text-right py-3 px-4 font-medium text-text-secondary">Paid</th>
                                <th className="text-right py-3 px-4 font-medium text-text-secondary">Pending</th>
                                <th className="text-center py-3 px-4 font-medium text-text-secondary">Status</th>
                                <th className="text-center py-3 px-4 font-medium text-text-secondary">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCustomers?.map((customer) => (
                                <tr key={customer?.id} className="border-b border-border hover:bg-muted/50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium text-foreground">{customer?.name}</p>
                                            <p className="text-sm text-text-secondary">Last payment: {customer?.lastPayment}</p>
                                        </div>
                                    </td>
                                    <td className="text-right py-4 px-4 text-foreground">{customer?.totalInvoices}</td>
                                    <td className="text-right py-4 px-4 font-medium text-foreground">
                                        {formatCurrency(customer?.totalAmount)}
                                    </td>
                                    <td className="text-right py-4 px-4 text-success">
                                        {formatCurrency(customer?.paidAmount)}
                                    </td>
                                    <td className="text-right py-4 px-4 text-warning">
                                        {formatCurrency(customer?.pendingAmount)}
                                    </td>
                                    <td className="text-center py-4 px-4">
                                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer?.status)}`}>
                                            <Icon name={getStatusIcon(customer?.status)} size={12} />
                                            <span className="capitalize">{customer?.status}</span>
                                        </div>
                                    </td>
                                    <td className="text-center py-4 px-4">
                                        <Button variant="ghost" size="sm" iconName="Eye">
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {topCustomers?.map((customer) => (
                        <div key={customer?.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-foreground truncate">{customer?.name}</h3>
                                    <p className="text-sm text-text-secondary">Last payment: {customer?.lastPayment}</p>
                                </div>
                                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer?.status)} ml-2 flex-shrink-0`}>
                                    <Icon name={getStatusIcon(customer?.status)} size={12} />
                                    <span className="capitalize">{customer?.status}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                <div>
                                    <p className="text-text-secondary">Invoices</p>
                                    <p className="font-medium text-foreground">{customer?.totalInvoices}</p>
                                </div>
                                <div>
                                    <p className="text-text-secondary">Total Amount</p>
                                    <p className="font-medium text-foreground">{formatCurrency(customer?.totalAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-text-secondary">Paid</p>
                                    <p className="font-medium text-success">{formatCurrency(customer?.paidAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-text-secondary">Pending</p>
                                    <p className="font-medium text-warning">{formatCurrency(customer?.pendingAmount)}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                                <Button variant="outline" size="sm" iconName="Eye" className="w-full">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Aging Analysis */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Outstanding Balance Aging</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {agingAnalysis?.map((item, index) => (
                        <div key={index} className="bg-surface-secondary rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-foreground text-sm sm:text-base truncate">{item?.range}</h3>
                                <span className="text-sm text-text-secondary flex-shrink-0 ml-2">{item?.percentage}%</span>
                            </div>
                            <p className="text-lg sm:text-2xl font-bold text-foreground mb-1 truncate">
                                {formatCurrency(item?.amount)}
                            </p>
                            <p className="text-xs sm:text-sm text-text-secondary">{item?.count} invoices</p>
                            <div className="mt-3 bg-border rounded-full h-2">
                                <div
                                    className="bg-primary rounded-full h-2 transition-all duration-300"
                                    style={{ width: `${item?.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                    <Button variant="outline" size="sm" iconName="Mail" className="w-full sm:w-auto">
                        Send Reminders
                    </Button>
                    <Button variant="outline" size="sm" iconName="FileText" className="w-full sm:w-auto">
                        Generate Statements
                    </Button>
                    <Button variant="outline" size="sm" iconName="Download" className="w-full sm:w-auto">
                        Export Aging Report
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerAnalysis;