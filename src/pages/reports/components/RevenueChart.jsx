import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const RevenueChart = () => {
    const monthlyRevenue = [
        { month: 'Jan', revenue: 245000, invoices: 45 },
        { month: 'Feb', revenue: 312000, invoices: 52 },
        { month: 'Mar', revenue: 189000, invoices: 38 },
        { month: 'Apr', revenue: 456000, invoices: 67 },
        { month: 'May', revenue: 398000, invoices: 59 },
        { month: 'Jun', revenue: 523000, invoices: 78 },
        { month: 'Jul', revenue: 467000, invoices: 71 },
        { month: 'Aug', revenue: 389000, invoices: 56 },
        { month: 'Sep', revenue: 445000, invoices: 64 },
        { month: 'Oct', revenue: 512000, invoices: 73 },
        { month: 'Nov', revenue: 398000, invoices: 58 },
        { month: 'Dec', revenue: 456000, invoices: 65 }
    ];

    const paymentStatus = [
        { name: 'Paid', value: 75, color: '#10B981' },
        { name: 'Pending', value: 15, color: '#F59E0B' },
        { name: 'Overdue', value: 10, color: '#EF4444' }
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })?.format(value);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload?.length) {
            return (
                <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-popover-foreground">{`${label}`}</p>
                    <p className="text-primary">
                        {`Revenue: ${formatCurrency(payload?.[0]?.value)}`}
                    </p>
                    <p className="text-text-secondary">
                        {`Invoices: ${payload?.[0]?.payload?.invoices}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Monthly Revenue Trends</h3>
                <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="month"
                                stroke="#6B7280"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#6B7280"
                                fontSize={12}
                                tickFormatter={(value) => `₹${(value / 1000)}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="revenue"
                                fill="var(--color-primary)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Payment Status Distribution */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Payment Status</h3>
                <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={paymentStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {paymentStatus?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry?.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'Percentage']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                    {paymentStatus?.map((status) => (
                        <div key={status?.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: status?.color }}
                                />
                                <span className="text-sm text-text-secondary">{status?.name}</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">{status?.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;