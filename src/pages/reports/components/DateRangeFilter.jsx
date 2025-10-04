import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange, onQuickSelect }) => {
    const quickRanges = [
        { label: 'This Month', value: 'this-month' },
        { label: 'Last Month', value: 'last-month' },
        { label: 'This Quarter', value: 'this-quarter' },
        { label: 'Last Quarter', value: 'last-quarter' },
        { label: 'This Year', value: 'this-year' },
        { label: 'Last Year', value: 'last-year' }
    ];

    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d?.toISOString()?.split('T')?.[0];
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Date Range</h2>
            <div className="space-y-6">
                {/* Custom Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        type="date"
                        value={formatDateForInput(startDate)}
                        onChange={(e) => onStartDateChange(e?.target?.value)}
                        className="w-full"
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={formatDateForInput(endDate)}
                        onChange={(e) => onEndDateChange(e?.target?.value)}
                        className="w-full"
                    />
                </div>

                {/* Quick Select Options */}
                <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Quick Select</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {quickRanges?.map((range) => (
                            <Button
                                key={range?.value}
                                variant="outline"
                                size="sm"
                                onClick={() => onQuickSelect(range?.value)}
                                className="text-sm"
                            >
                                {range?.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateRangeFilter;