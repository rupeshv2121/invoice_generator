import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const InvoiceChart = ({ monthlyData, statusData }) => {
    const COLORS = {
        paid: '#10B981',
        pending: '#F59E0B',
        overdue: '#EF4444',
        draft: '#6B7280'
    };

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
                <div className="bg-popover border border-border rounded-lg p-3 invoice-shadow-md">
                    <p className="text-sm font-medium text-popover-foreground">{`${label}`}</p>
                    <p className="text-sm text-popover-foreground">
                        Amount: {formatCurrency(payload?.[0]?.value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const PieTooltip = ({ active, payload }) => {
        if (active && payload && payload?.length) {
            return (
                <div className="bg-popover border border-border rounded-lg p-3 invoice-shadow-md">
                    <p className="text-sm font-medium text-popover-foreground capitalize">
                        {payload?.[0]?.name}: {payload?.[0]?.value} invoices
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="bg-card border border-border rounded-lg p-6 invoice-shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                dataKey="month"
                                stroke="var(--color-text-secondary)"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="var(--color-text-secondary)"
                                fontSize={12}
                                tickFormatter={(value) => `₹${(value / 1000)}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="amount"
                                fill="var(--color-primary)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Invoice Status Distribution */}
            <div className="bg-card border border-border rounded-lg p-6 invoice-shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="count"
                            >
                                {statusData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS?.[entry?.status]} />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {statusData?.map((entry) => (
                        <div key={entry?.status} className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS?.[entry?.status] }}
                            />
                            <span className="text-sm text-text-secondary capitalize">
                                {entry?.status} ({entry?.count})
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InvoiceChart;