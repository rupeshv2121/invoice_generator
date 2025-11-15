import { useCallback, useEffect, useState } from 'react';
import { useCustomersService } from '../../api/customers';
import { useInvoiceService } from '../../api/invoice';
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
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({
        totalRevenue: 0,
        totalTax: 0,
        outstanding: 0,
        activeCustomers: 0,
        revenueGrowth: 0,
        outstandingPercentage: 0,
        newCustomers: 0,
        monthlyRevenue: [],
        paymentStatus: [],
        gstBreakdown: {},
        topCustomers: [],
        invoices: [],
        customers: []
    });

    const { getInvoices } = useInvoiceService();
    const { getCustomers } = useCustomersService();

    useEffect(() => {
        // Set default date range to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(firstDay?.toISOString()?.split('T')?.[0]);
        setEndDate(lastDay?.toISOString()?.split('T')?.[0]);
    }, []);

    // Fetch data when date range changes
    useEffect(() => {
        if (startDate && endDate) {
            fetchReportData();
            setLastUpdated(new Date());
        }
    }, [startDate, endDate]);

    // Auto-refresh data every 5 minutes (separate from date changes)
    useEffect(() => {
        const interval = setInterval(() => {
            if (startDate && endDate) {
                fetchReportData();
                setLastUpdated(new Date());
            }
        }, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, [startDate, endDate]);

    const fetchReportData = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch all invoices and customers
            const invoices = await getInvoices();
            const customers = await getCustomers();

            // Filter invoices by date range
            const filteredInvoices = invoices.filter(inv => {
                const invDate = new Date(inv.invoiceDate);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return invDate >= start && invDate <= end;
            });

            // Calculate total revenue (all paid invoices in date range)
            const totalRevenue = filteredInvoices
                .filter(inv => inv.status === 'Paid' || inv.status === 'paid')
                .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

            // Calculate total tax (CGST + SGST + IGST)
            const totalTax = filteredInvoices.reduce((sum, inv) => {
                const cgst = inv.totalCgst || 0;
                const sgst = inv.totalSgst || 0;
                const igst = inv.totalIgst || 0;
                return sum + cgst + sgst + igst;
            }, 0);

            // Calculate outstanding amount (pending + overdue)
            const outstanding = filteredInvoices
                .filter(inv => {
                    const status = inv.status?.toLowerCase();
                    return status === 'pending' || status === 'overdue';
                })
                .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

            // Calculate outstanding percentage
            const totalAmount = filteredInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
            const outstandingPercentage = totalAmount > 0 ? ((outstanding / totalAmount) * 100).toFixed(1) : 0;

            // Calculate revenue growth (compare with previous period)
            const periodLength = new Date(endDate) - new Date(startDate);
            const prevStartDate = new Date(new Date(startDate).getTime() - periodLength);
            const prevEndDate = new Date(startDate);

            const prevPeriodInvoices = invoices.filter(inv => {
                const invDate = new Date(inv.invoiceDate);
                return invDate >= prevStartDate && invDate < prevEndDate && (inv.status === 'Paid' || inv.status === 'paid');
            });

            const prevRevenue = prevPeriodInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
            const revenueGrowth = prevRevenue > 0 ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : 0;

            // Count active customers (customers with invoices in date range)
            const activeCustomerIds = new Set(filteredInvoices.map(inv => inv.customerId));
            const activeCustomers = activeCustomerIds.size;

            // Count new customers (created in date range)
            const newCustomers = customers.filter(cust => {
                const custDate = new Date(cust.createdAt);
                return custDate >= new Date(startDate) && custDate <= new Date(endDate);
            }).length;

            // Calculate monthly revenue based on selected date range
            const monthlyRevenue = [];
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            // Calculate the number of months in the range
            const monthDiff = (endDateObj.getFullYear() - startDateObj.getFullYear()) * 12 +
                (endDateObj.getMonth() - startDateObj.getMonth());

            // If range is less than 12 months, show only that range
            // Otherwise, show last 12 months
            const monthsToShow = Math.min(monthDiff + 1, 12);

            for (let i = monthsToShow - 1; i >= 0; i--) {
                const monthDate = new Date(endDateObj.getFullYear(), endDateObj.getMonth() - i, 1);
                const monthName = monthDate.toLocaleString('default', { month: 'short' });
                const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

                const monthInvoices = filteredInvoices.filter(inv => {
                    const invDate = new Date(inv.invoiceDate);
                    return invDate >= monthStart && invDate <= monthEnd && (inv.status === 'Paid' || inv.status === 'paid');
                });

                const revenue = monthInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
                monthlyRevenue.push({ month: monthName, revenue, invoices: monthInvoices.length });
            }

            // Calculate payment status distribution
            const totalInvoices = filteredInvoices.length;
            const paidCount = filteredInvoices.filter(inv => inv.status?.toLowerCase() === 'paid').length;
            const pendingCount = filteredInvoices.filter(inv => inv.status?.toLowerCase() === 'pending').length;
            const overdueCount = filteredInvoices.filter(inv => inv.status?.toLowerCase() === 'overdue').length;

            const paymentStatus = [
                { name: 'Paid', value: totalInvoices > 0 ? ((paidCount / totalInvoices) * 100).toFixed(0) : 0, color: '#10B981' },
                { name: 'Pending', value: totalInvoices > 0 ? ((pendingCount / totalInvoices) * 100).toFixed(0) : 0, color: '#F59E0B' },
                { name: 'Overdue', value: totalInvoices > 0 ? ((overdueCount / totalInvoices) * 100).toFixed(0) : 0, color: '#EF4444' }
            ];

            // Calculate GST breakdown
            const cgstTotal = filteredInvoices.reduce((sum, inv) => sum + (inv.totalCgst || 0), 0);
            const sgstTotal = filteredInvoices.reduce((sum, inv) => sum + (inv.totalSgst || 0), 0);
            const igstTotal = filteredInvoices.reduce((sum, inv) => sum + (inv.totalIgst || 0), 0);

            // Calculate top customers by revenue
            const customerRevenue = new Map();
            filteredInvoices.forEach(inv => {
                const custId = inv.customerId;
                const custName = inv.customerName || 'Unknown';
                if (!customerRevenue.has(custId)) {
                    customerRevenue.set(custId, {
                        id: custId,
                        name: custName,
                        totalInvoices: 0,
                        totalAmount: 0,
                        paidAmount: 0,
                        pendingAmount: 0,
                        lastPayment: null
                    });
                }
                const custData = customerRevenue.get(custId);
                custData.totalInvoices++;
                custData.totalAmount += inv.grandTotal || 0;

                if (inv.status?.toLowerCase() === 'paid') {
                    custData.paidAmount += inv.grandTotal || 0;
                    if (!custData.lastPayment || new Date(inv.invoiceDate) > new Date(custData.lastPayment)) {
                        custData.lastPayment = inv.invoiceDate;
                    }
                } else {
                    custData.pendingAmount += inv.grandTotal || 0;
                }
            });

            const topCustomers = Array.from(customerRevenue.values())
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .slice(0, 5)
                .map(cust => ({
                    ...cust,
                    status: cust.pendingAmount === 0 ? 'excellent' :
                        cust.pendingAmount < cust.totalAmount * 0.2 ? 'good' :
                            cust.pendingAmount < cust.totalAmount * 0.5 ? 'average' : 'poor'
                }));

            setReportData({
                totalRevenue,
                totalTax,
                outstanding,
                activeCustomers,
                revenueGrowth,
                outstandingPercentage,
                newCustomers,
                monthlyRevenue,
                paymentStatus,
                gstBreakdown: {
                    cgst: cgstTotal,
                    sgst: sgstTotal,
                    igst: igstTotal,
                    total: cgstTotal + sgstTotal + igstTotal
                },
                topCustomers,
                invoices: filteredInvoices,
                customers
            });

        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getInvoices, getCustomers]);

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
        await fetchReportData();
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
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reports & Analytics</h1>
                            <p className="text-text-secondary mt-2">
                                Comprehensive business insights and GST compliance reporting
                            </p>
                        </div>
                        <div className="text-left lg:text-right">
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
                        <RevenueChart
                            monthlyRevenue={reportData.monthlyRevenue}
                            paymentStatus={reportData.paymentStatus}
                            loading={loading}
                        />
                    </div>

                    {/* GST Compliance Section */}
                    <div className="mb-8">
                        <GSTComplianceSection
                            gstData={reportData.gstBreakdown}
                            invoices={reportData.invoices}
                            dateRange={{ start: startDate, end: endDate }}
                            loading={loading}
                        />
                    </div>

                    {/* Customer Analysis */}
                    <div className="mb-8">
                        <CustomerAnalysis
                            topCustomers={reportData.topCustomers}
                            invoices={reportData.invoices}
                            loading={loading}
                        />
                    </div>

                    {/* Export Controls */}
                    <div className="mb-8">
                        <ExportControls
                            selectedReportType={selectedReportType}
                            dateRange={{ start: startDate, end: endDate }}
                        />
                    </div>

                    {/* Summary Cards */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                            <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs lg:text-sm text-text-secondary mb-1 truncate">Total Revenue</p>
                                        <p className="text-xl lg:text-2xl font-bold text-foreground truncate">
                                            ₹{reportData.totalRevenue.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-primary rounded" />
                                    </div>
                                </div>
                                <p className={`text-xs lg:text-sm mt-2 truncate ${reportData.revenueGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                                    {reportData.revenueGrowth >= 0 ? '+' : ''}{reportData.revenueGrowth}% from last period
                                </p>
                            </div>

                            <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs lg:text-sm text-text-secondary mb-1 truncate">Total Tax Collected</p>
                                        <p className="text-xl lg:text-2xl font-bold text-foreground truncate">
                                            ₹{reportData.totalTax.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-success rounded" />
                                    </div>
                                </div>
                                <p className="text-xs lg:text-sm text-success mt-2 truncate">GST compliant</p>
                            </div>

                            <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs lg:text-sm text-text-secondary mb-1 truncate">Outstanding Amount</p>
                                        <p className="text-xl lg:text-2xl font-bold text-foreground truncate">
                                            ₹{reportData.outstanding.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-warning rounded" />
                                    </div>
                                </div>
                                <p className="text-xs lg:text-sm text-warning mt-2 truncate">
                                    {reportData.outstandingPercentage}% of total sales
                                </p>
                            </div>

                            <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs lg:text-sm text-text-secondary mb-1 truncate">Active Customers</p>
                                        <p className="text-xl lg:text-2xl font-bold text-foreground truncate">
                                            {reportData.activeCustomers}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-secondary rounded" />
                                    </div>
                                </div>
                                <p className="text-xs lg:text-sm text-success mt-2 truncate">
                                    +{reportData.newCustomers} new this period
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <QuickActionButton />
        </div>
    );
};

export default Reports;