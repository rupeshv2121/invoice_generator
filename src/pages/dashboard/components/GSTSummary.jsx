import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GSTSummary = ({ gstData }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        })?.format(amount);
    };

    const getCurrentFinancialYear = () => {
        const today = new Date();
        const currentYear = today?.getFullYear();
        const currentMonth = today?.getMonth();

        if (currentMonth >= 3) { // April onwards
            return `${currentYear}-${(currentYear + 1)?.toString()?.slice(-2)}`;
        } else {
            return `${currentYear - 1}-${currentYear?.toString()?.slice(-2)}`;
        }
    };

    const getComplianceStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'compliant':
                return {
                    color: 'text-success',
                    bgColor: 'bg-success',
                    icon: 'CheckCircle'
                };
            case 'pending':
                return {
                    color: 'text-warning',
                    bgColor: 'bg-warning',
                    icon: 'Clock'
                };
            case 'overdue':
                return {
                    color: 'text-error',
                    bgColor: 'bg-error',
                    icon: 'AlertTriangle'
                };
            default:
                return {
                    color: 'text-text-secondary',
                    bgColor: 'bg-muted',
                    icon: 'Info'
                };
        }
    };

    const statusInfo = getComplianceStatus(gstData?.complianceStatus);

    return (
        <div className="bg-card border border-border rounded-lg invoice-shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${statusInfo?.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon name={statusInfo?.icon} size={20} color="white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">GST Summary</h3>
                        <p className="text-sm text-text-secondary">
                            Financial Year {getCurrentFinancialYear()}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-medium ${statusInfo?.color}`}>
                        {gstData?.complianceStatus}
                    </p>
                    <p className="text-xs text-text-secondary">Compliance Status</p>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(gstData?.cgst)}</p>
                        <p className="text-sm text-text-secondary">CGST Collected</p>
                    </div>
                    <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(gstData?.sgst)}</p>
                        <p className="text-sm text-text-secondary">SGST Collected</p>
                    </div>
                    <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(gstData?.igst)}</p>
                        <p className="text-sm text-text-secondary">IGST Collected</p>
                    </div>
                    <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(gstData?.totalTax)}</p>
                        <p className="text-sm text-text-secondary">Total Tax</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">GSTR-1 Filing</span>
                            <span className="text-xs text-text-secondary">Due: {gstData?.gstr1DueDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${gstData?.gstr1Status === 'filed' ? 'bg-success' : 'bg-warning'}`} />
                            <span className="text-sm text-text-secondary capitalize">{gstData?.gstr1Status}</span>
                        </div>
                    </div>

                    <div className="flex-1 p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">GSTR-3B Filing</span>
                            <span className="text-xs text-text-secondary">Due: {gstData?.gstr3bDueDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${gstData?.gstr3bStatus === 'filed' ? 'bg-success' : 'bg-warning'}`} />
                            <span className="text-sm text-text-secondary capitalize">{gstData?.gstr3bStatus}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Button
                        variant="outline"
                        iconName="FileText"
                        iconPosition="left"
                        onClick={() => {/* Handle GST report generation */ }}
                    >
                        Generate GST Report
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GSTSummary;