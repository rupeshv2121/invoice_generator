import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GSTComplianceSection = () => {
    const currentPeriod = {
        period: 'October 2024',
        totalSales: 2456789,
        cgst: 221112,
        sgst: 221112,
        igst: 98765,
        totalTax: 540989,
        filingStatus: 'pending',
        dueDate: '20/11/2024'
    };

    const gstBreakdown = [
        {
            type: 'CGST',
            rate: '9%',
            taxableAmount: 2456789,
            taxAmount: 221112,
            color: 'bg-blue-500'
        },
        {
            type: 'SGST',
            rate: '9%',
            taxableAmount: 2456789,
            taxAmount: 221112,
            color: 'bg-green-500'
        },
        {
            type: 'IGST',
            rate: '18%',
            taxableAmount: 548694,
            taxAmount: 98765,
            color: 'bg-purple-500'
        }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        })?.format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'filed': return 'text-success bg-success/10';
            case 'pending': return 'text-warning bg-warning/10';
            case 'overdue': return 'text-destructive bg-destructive/10';
            default: return 'text-text-secondary bg-muted';
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">GST Compliance</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" iconName="Download">
                        Download GSTR-1
                    </Button>
                    <Button variant="outline" size="sm" iconName="Download">
                        Download GSTR-3B
                    </Button>
                </div>
            </div>
            {/* Current Period Summary */}
            <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">{currentPeriod?.period}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentPeriod?.filingStatus)}`}>
                        <div className="flex items-center space-x-1">
                            <Icon
                                name={currentPeriod?.filingStatus === 'filed' ? 'CheckCircle' : 'Clock'}
                                size={16}
                            />
                            <span className="capitalize">{currentPeriod?.filingStatus}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-text-secondary mb-1">Total Sales</p>
                        <p className="text-lg font-semibold text-foreground">
                            {formatCurrency(currentPeriod?.totalSales)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-text-secondary mb-1">Total Tax</p>
                        <p className="text-lg font-semibold text-foreground">
                            {formatCurrency(currentPeriod?.totalTax)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-text-secondary mb-1">Due Date</p>
                        <p className="text-lg font-semibold text-foreground">{currentPeriod?.dueDate}</p>
                    </div>
                    <div className="text-center">
                        <Button
                            variant={currentPeriod?.filingStatus === 'pending' ? 'default' : 'outline'}
                            size="sm"
                            className="w-full"
                        >
                            {currentPeriod?.filingStatus === 'pending' ? 'File Return' : 'View Filed'}
                        </Button>
                    </div>
                </div>
            </div>
            {/* GST Breakdown */}
            <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Tax Breakdown</h3>
                <div className="space-y-4">
                    {gstBreakdown?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className={`w-4 h-4 rounded-full ${item?.color}`} />
                                <div>
                                    <h4 className="font-medium text-foreground">{item?.type}</h4>
                                    <p className="text-sm text-text-secondary">Rate: {item?.rate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-foreground">{formatCurrency(item?.taxAmount)}</p>
                                <p className="text-sm text-text-secondary">
                                    on {formatCurrency(item?.taxableAmount)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" iconName="FileText">
                        Generate GSTR-1
                    </Button>
                    <Button variant="outline" size="sm" iconName="FileText">
                        Generate GSTR-3B
                    </Button>
                    <Button variant="outline" size="sm" iconName="Calculator">
                        Tax Calculator
                    </Button>
                    <Button variant="outline" size="sm" iconName="History">
                        Filing History
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GSTComplianceSection;