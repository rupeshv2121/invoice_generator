import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportTypeSelector = ({ selectedType, onTypeChange, onGenerateReport, isGenerating }) => {
    const reportTypes = [
        {
            id: 'gst-summary',
            name: 'GST Summary',
            description: 'Complete GST breakdown with CGST, SGST, IGST details',
            icon: 'FileText'
        },
        {
            id: 'sales-analysis',
            name: 'Sales Analysis',
            description: 'Revenue trends and performance metrics',
            icon: 'TrendingUp'
        },
        {
            id: 'customer-statements',
            name: 'Customer Statements',
            description: 'Individual customer payment history and outstanding balances',
            icon: 'Users'
        },
        {
            id: 'tax-period',
            name: 'Tax Period Reports',
            description: 'Period-wise tax calculations and compliance reports',
            icon: 'Calendar'
        }
    ];

    return (
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Report Type</h2>
                <Button
                    variant="default"
                    onClick={onGenerateReport}
                    loading={isGenerating}
                    iconName="Download"
                    iconPosition="left"
                    disabled={!selectedType}
                    className="w-full sm:w-auto"
                >
                    Generate Report
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {reportTypes?.map((type) => (
                    <div
                        key={type?.id}
                        onClick={() => onTypeChange(type?.id)}
                        className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedType === type?.id
                                ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${selectedType === type?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                }`}>
                                <Icon name={type?.icon} size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground mb-1 truncate">{type?.name}</h3>
                                <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">{type?.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportTypeSelector;