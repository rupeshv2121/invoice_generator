import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import GSTSummary from './components/GSTSummary';
import InvoiceChart from './components/InvoiceChart';
import MetricsCard from './components/MetricsCard';
import PaymentReminders from './components/PaymentReminders';
import QuickActions from './components/QuickActions';
import RecentInvoicesTable from './components/RecentInvoicesTable';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        metrics: [],
        recentInvoices: [],
        paymentReminders: [],
        monthlyData: [],
        statusData: [],
        gstData: {}
    });

    useEffect(() => {
        // Mock data - in real app, this would come from API
        const mockData = {
            metrics: [
                {
                    title: "Total Invoices",
                    value: "1,247",
                    icon: "FileText",
                    trend: "up",
                    trendValue: "+12.5%",
                    color: "primary"
                },
                {
                    title: "Pending Payments",
                    value: "₹2,45,680",
                    icon: "Clock",
                    trend: "down",
                    trendValue: "-8.2%",
                    color: "warning"
                },
                {
                    title: "Overdue Amount",
                    value: "₹45,230",
                    icon: "AlertTriangle",
                    trend: "up",
                    trendValue: "+3.1%",
                    color: "error"
                },
                {
                    title: "Monthly Revenue",
                    value: "₹8,95,420",
                    icon: "TrendingUp",
                    trend: "up",
                    trendValue: "+18.7%",
                    color: "success"
                }
            ],
            recentInvoices: [
                {
                    id: "INV-2024-001",
                    invoiceNumber: "INV-2024-001",
                    customerName: "Rajesh Kumar Enterprises",
                    amount: 45680,
                    dueDate: "2024-10-15",
                    status: "Pending"
                },
                {
                    id: "INV-2024-002",
                    invoiceNumber: "INV-2024-002",
                    customerName: "Sharma Trading Co.",
                    amount: 78920,
                    dueDate: "2024-10-12",
                    status: "Paid"
                },
                {
                    id: "INV-2024-003",
                    invoiceNumber: "INV-2024-003",
                    customerName: "Modern Solutions Pvt Ltd",
                    amount: 125340,
                    dueDate: "2024-09-28",
                    status: "Overdue"
                },
                {
                    id: "INV-2024-004",
                    invoiceNumber: "INV-2024-004",
                    customerName: "Tech Innovations Inc",
                    amount: 67890,
                    dueDate: "2024-10-20",
                    status: "Draft"
                },
                {
                    id: "INV-2024-005",
                    invoiceNumber: "INV-2024-005",
                    customerName: "Global Exports Ltd",
                    amount: 234560,
                    dueDate: "2024-10-18",
                    status: "Pending"
                }
            ],
            paymentReminders: [
                {
                    id: "REM-001",
                    customerName: "Modern Solutions Pvt Ltd",
                    invoiceNumber: "INV-2024-003",
                    amount: 125340,
                    dueDate: "2024-09-28"
                },
                {
                    id: "REM-002",
                    customerName: "ABC Manufacturing",
                    invoiceNumber: "INV-2024-015",
                    amount: 89760,
                    dueDate: "2024-09-25"
                },
                {
                    id: "REM-003",
                    customerName: "XYZ Services",
                    invoiceNumber: "INV-2024-008",
                    amount: 45230,
                    dueDate: "2024-09-30"
                }
            ],
            monthlyData: [
                { month: "Apr", amount: 650000 },
                { month: "May", amount: 780000 },
                { month: "Jun", amount: 920000 },
                { month: "Jul", amount: 850000 },
                { month: "Aug", amount: 1100000 },
                { month: "Sep", amount: 895420 }
            ],
            statusData: [
                { status: "paid", count: 856 },
                { status: "pending", count: 234 },
                { status: "overdue", count: 89 },
                { status: "draft", count: 68 }
            ],
            gstData: {
                cgst: 125680,
                sgst: 125680,
                igst: 89450,
                totalTax: 340810,
                complianceStatus: "Compliant",
                gstr1DueDate: "11/10/2024",
                gstr1Status: "filed",
                gstr3bDueDate: "20/10/2024",
                gstr3bStatus: "pending"
            }
        };

        setDashboardData(mockData);
    }, []);



    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb />

                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, Business Owner!
                        </h1>
                        <p className="text-gray-600">
                            Here's what's happening with your invoices today.
                        </p>
                    </div>

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
                        <div>
                            <PaymentReminders reminders={dashboardData?.paymentReminders} />
                        </div>
                    </div>

                    {/* GST Summary */}
                    <div className="mb-8">
                        <GSTSummary gstData={dashboardData?.gstData} />
                    </div>
                </div>
            </main>
            <QuickActionButton />
        </div>
    );
};

export default Dashboard;