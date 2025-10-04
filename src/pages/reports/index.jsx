import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CustomerAnalysis from './components/CustomerAnalysis';
import DateRangeFilter from './components/DateRangeFilter';
import ExportControls from './components/ExportControls';
import GSTComplianceSection from './components/GSTComplianceSection';
import ReportTypeSelector from './components/ReportTypeSelector';
import RevenueChart from './components/RevenueChart';

const Reports = () => {
    const [selectedReportType, setSelectedReportType] = useState('gst-summary');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        // Set default date range to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(firstDay?.toISOString()?.split('T')?.[0]);
        setEndDate(lastDay?.toISOString()?.split('T')?.[0]);

        // Auto-refresh data every 5 minutes
        const interval = setInterval(() => {
            setLastUpdated(new Date());
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    const handleQuickDateSelect = (range) => {
        const now = new Date();
        let start, end;

        switch (range) {
            case 'this-month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'last-month':
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'this-quarter':
                const quarterStart = Math.floor(now?.getMonth() / 3) * 3;
                start = new Date(now.getFullYear(), quarterStart, 1);
                end = new Date(now.getFullYear(), quarterStart + 3, 0);
                break;
            case 'last-quarter':
                const lastQuarterStart = Math.floor(now?.getMonth() / 3) * 3 - 3;
                start = new Date(now.getFullYear(), lastQuarterStart, 1);
                end = new Date(now.getFullYear(), lastQuarterStart + 3, 0);
                break;
            case 'this-year':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
            case 'last-year':
                start = new Date(now.getFullYear() - 1, 0, 1);
                end = new Date(now.getFullYear() - 1, 11, 31);
                break;
            default:
                return;
        }

        setStartDate(start?.toISOString()?.split('T')?.[0]);
        setEndDate(end?.toISOString()?.split('T')?.[0]);
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);

        // Simulate report generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsGenerating(false);
        setLastUpdated(new Date());
    };

    const formatLastUpdated = () => {
        return lastUpdated?.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb />

                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
                            <p className="text-text-secondary mt-2">
                                Comprehensive business insights and GST compliance reporting
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-text-secondary">Last Updated</p>
                            <p className="text-sm font-medium text-foreground">{formatLastUpdated()}</p>
                        </div>
                    </div>

                    {/* Report Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2">
                            <ReportTypeSelector
                                selectedType={selectedReportType}
                                onTypeChange={setSelectedReportType}
                                onGenerateReport={handleGenerateReport}
                                isGenerating={isGenerating}
                            />
                        </div>
                        <div>
                            <DateRangeFilter
                                startDate={startDate}
                                endDate={endDate}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                                onQuickSelect={handleQuickDateSelect}
                            />
                        </div>
                    </div>

                    {/* Charts and Visualizations */}
                    <div className="mb-8">
                        <RevenueChart />
                    </div>

                    {/* GST Compliance Section */}
                    <div className="mb-8">
                        <GSTComplianceSection />
                    </div>

                    {/* Customer Analysis */}
                    <div className="mb-8">
                        <CustomerAnalysis />
                    </div>

                    {/* Export Controls */}
                    <div className="mb-8">
                        <ExportControls
                            selectedReportType={selectedReportType}
                            dateRange={{ start: startDate, end: endDate }}
                        />
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary mb-1">Total Revenue</p>
                                    <p className="text-2xl font-bold text-foreground">₹45,67,890</p>
                                </div>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 bg-primary rounded" />
                                </div>
                            </div>
                            <p className="text-sm text-success mt-2">+12.5% from last month</p>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary mb-1">Total Tax Collected</p>
                                    <p className="text-2xl font-bold text-foreground">₹8,22,221</p>
                                </div>
                                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 bg-success rounded" />
                                </div>
                            </div>
                            <p className="text-sm text-success mt-2">GST compliant</p>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary mb-1">Outstanding Amount</p>
                                    <p className="text-2xl font-bold text-foreground">₹7,00,000</p>
                                </div>
                                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 bg-warning rounded" />
                                </div>
                            </div>
                            <p className="text-sm text-warning mt-2">15% of total sales</p>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-secondary mb-1">Active Customers</p>
                                    <p className="text-2xl font-bold text-foreground">147</p>
                                </div>
                                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 bg-secondary rounded" />
                                </div>
                            </div>
                            <p className="text-sm text-success mt-2">+8 new this month</p>
                        </div>
                    </div>
                </div>
            </main>

            <QuickActionButton />
        </div>
    );
};

export default Reports;