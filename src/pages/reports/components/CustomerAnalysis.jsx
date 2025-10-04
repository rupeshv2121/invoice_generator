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
        <div className="space-y-6">
            {/* Top Customers */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Top Customers</h2>
                    <Button variant="outline" size="sm" iconName="Download">
                        Export Customer Report
                    </Button>
                </div>

                <div className="overflow-x-auto">
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
            </div>
            {/* Aging Analysis */}
            <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Outstanding Balance Aging</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {agingAnalysis?.map((item, index) => (
                        <div key={index} className="bg-surface-secondary rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-foreground">{item?.range}</h3>
                                <span className="text-sm text-text-secondary">{item?.percentage}%</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground mb-1">
                                {formatCurrency(item?.amount)}
                            </p>
                            <p className="text-sm text-text-secondary">{item?.count} invoices</p>
                            <div className="mt-3 bg-border rounded-full h-2">
                                <div
                                    className="bg-primary rounded-full h-2 transition-all duration-300"
                                    style={{ width: `${item?.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" iconName="Mail">
                        Send Reminders
                    </Button>
                    <Button variant="outline" size="sm" iconName="FileText">
                        Generate Statements
                    </Button>
                    <Button variant="outline" size="sm" iconName="Download">
                        Export Aging Report
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerAnalysis;