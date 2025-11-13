import { useEffect, useState } from 'react';
import { useCustomersService } from '../../api/customers';
import { useDashboardService } from '../../api/dashboard';
import { useInvoiceService } from '../../api/invoice';
import { useItemService } from '../../api/items';
import SubscriptionBanner from '../../components/SubscriptionBanner';
import SubscriptionStatusCard from '../../components/SubscriptionStatusCard';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { useAuth } from '../../context/AuthContext';
import GSTSummary from './components/GSTSummary';
import InvoiceChart from './components/InvoiceChart';
import MetricsCard from './components/MetricsCard';
import PaymentReminders from './components/PaymentReminders';
import QuickActions from './components/QuickActions';
import RecentInvoicesTable from './components/RecentInvoicesTable';

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        metrics: [],
        recentInvoices: [],
        paymentReminders: [],
        monthlyData: [],
        statusData: [],
        gstData: {}
    });
    const [loading, setLoading] = useState(true);

    const { getRecentInvoices, getOverdueInvoices } = useDashboardService();
    const { getInvoices } = useInvoiceService();
    const { getCustomers, customerStats } = useCustomersService();
    const { getItems, itemsStats } = useItemService();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch all invoices
                const invoices = await getInvoices();

                // Fetch recent invoices (last 5)
                const recentInvoices = invoices.slice(0, 5).map(inv => ({
                    id: inv.id,
                    invoiceNumber: inv.invoiceNumber,
                    customerName: inv.customerName || 'N/A',
                    amount: inv.grandTotal || 0,
                    dueDate: inv.dueDate || inv.invoiceDate,
                    status: inv.status || 'Draft'
                }));

                // Calculate metrics
                const totalInvoices = invoices.length;
                const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'pending');
                const paidInvoices = invoices.filter(inv => inv.status === 'Paid' || inv.status === 'paid');
                const overdueInvoices = invoices.filter(inv => {
                    if (inv.status === 'Overdue' || inv.status === 'overdue') return true;
                    if (inv.dueDate && new Date(inv.dueDate) < new Date() && inv.status !== 'Paid') return true;
                    return false;
                });

                const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
                const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
                const monthlyRevenue = paidInvoices
                    .filter(inv => {
                        const invDate = new Date(inv.invoiceDate);
                        const now = new Date();
                        return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
                    })
                    .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

                // Payment reminders (overdue invoices)
                const paymentReminders = overdueInvoices.slice(0, 3).map(inv => ({
                    id: inv.id,
                    customerName: inv.customerName || 'N/A',
                    invoiceNumber: inv.invoiceNumber,
                    amount: inv.grandTotal || 0,
                    dueDate: inv.dueDate || inv.invoiceDate
                }));

                // Calculate monthly data (last 6 months)
                const monthlyData = [];
                const now = new Date();
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthName = date.toLocaleString('default', { month: 'short' });
                    const monthTotal = invoices
                        .filter(inv => {
                            const invDate = new Date(inv.invoiceDate);
                            return invDate.getMonth() === date.getMonth() &&
                                invDate.getFullYear() === date.getFullYear() &&
                                (inv.status === 'Paid' || inv.status === 'paid');
                        })
                        .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
                    monthlyData.push({ month: monthName, amount: monthTotal });
                }

                // Status data
                const statusData = [
                    { status: "paid", count: paidInvoices.length },
                    { status: "pending", count: pendingInvoices.length },
                    { status: "overdue", count: overdueInvoices.length },
                    { status: "draft", count: invoices.filter(inv => inv.status === 'Draft' || inv.status === 'draft').length }
                ];

                // Calculate GST data
                const totalCgst = invoices.reduce((sum, inv) => sum + (inv.totalCgst || 0), 0);
                const totalSgst = invoices.reduce((sum, inv) => sum + (inv.totalSgst || 0), 0);
                const totalIgst = invoices.reduce((sum, inv) => sum + (inv.totalIgst || 0), 0);

                const mockData = {
                    metrics: [
                        {
                            title: "Total Invoices",
                            value: totalInvoices.toString(),
                            icon: "FileText",
                            trend: "up",
                            trendValue: "+12.5%",
                            color: "primary"
                        },
                        {
                            title: "Pending Payments",
                            value: `₹${pendingAmount.toLocaleString('en-IN')}`,
                            icon: "Clock",
                            trend: pendingInvoices.length > 0 ? "up" : "down",
                            trendValue: `${pendingInvoices.length} invoices`,
                            color: "warning"
                        },
                        {
                            title: "Overdue Amount",
                            value: `₹${overdueAmount.toLocaleString('en-IN')}`,
                            icon: "AlertTriangle",
                            trend: overdueInvoices.length > 0 ? "up" : "down",
                            trendValue: `${overdueInvoices.length} invoices`,
                            color: "error"
                        },
                        {
                            title: "Monthly Revenue",
                            value: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
                            icon: "TrendingUp",
                            trend: "up",
                            trendValue: "This month",
                            color: "success"
                        }
                    ],
                    recentInvoices,
                    paymentReminders,
                    monthlyData,
                    statusData,
                    gstData: {
                        cgst: totalCgst,
                        sgst: totalSgst,
                        igst: totalIgst,
                        totalTax: totalCgst + totalSgst + totalIgst,
                        complianceStatus: "Compliant",
                        gstr1DueDate: "11/11/2025",
                        gstr1Status: "pending",
                        gstr3bDueDate: "20/11/2025",
                        gstr3bStatus: "pending"
                    }
                };

                setDashboardData(mockData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);



    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb />
                    {console.log("User in Dashboard : ", user)}
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.identities[0].identity_data.full_name}
                        </h1>
                        <p className="text-gray-600">
                            Here's what's happening with your invoices today.
                        </p>
                    </div>

                    {/* Subscription Banner */}
                    <SubscriptionBanner />

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Metrics Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {dashboardData?.metrics?.map((metric, index) => (
                                    <MetricsCard
                                        key={index}
                                        title={metric?.title}
                                        value={metric?.value}
                                        icon={metric?.icon}
                                        trend={metric?.trend}
                                        trendValue={metric?.trendValue}
                                        color={metric?.color}
                                    />
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="mb-8">
                                <QuickActions />
                            </div>

                            {/* Charts */}
                            <div className="mb-8">
                                <InvoiceChart
                                    monthlyData={dashboardData?.monthlyData}
                                    statusData={dashboardData?.statusData}
                                />
                            </div>

                            {/* Recent Invoices and Payment Reminders */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                                <div className="xl:col-span-2">
                                    <RecentInvoicesTable invoices={dashboardData?.recentInvoices} />
                                </div>
                                <div className="space-y-6">
                                    {/* Subscription Status Card */}
                                    <SubscriptionStatusCard />

                                    {/* Payment Reminders */}
                                    <PaymentReminders reminders={dashboardData?.paymentReminders} />
                                </div>
                            </div>

                            {/* GST Summary */}
                            <div className="mb-8">
                                <GSTSummary gstData={dashboardData?.gstData} />
                            </div>
                        </>
                    )}
                </div>
            </main>
            <QuickActionButton />
        </div>
    );
};

export default Dashboard;