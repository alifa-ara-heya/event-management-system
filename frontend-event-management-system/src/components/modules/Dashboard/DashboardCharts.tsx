"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, Calendar, Activity } from "lucide-react";

interface DashboardChartsProps {
    stats: {
        overview: {
            totalJoinedEvents: number;
            upcomingEvents: number;
            pastEvents: number;
            totalReviews: number;
        };
        upcomingEvents: Array<{
            id: string;
            name: string;
            date: string;
            location: string;
        }>;
    };
    paymentStats: {
        totalSpent: number;
        totalPayments: number;
        paidPayments: number;
        unpaidPayments: number;
        monthlySpending: Array<{
            month: string;
            amount: number;
            count: number;
        }>;
        eventTypeDistribution: Array<{
            type: string;
            count: number;
            amount: number;
        }>;
    };
    eventActivity?: Array<{
        month: string;
        events: number;
    }>;
}

export function DashboardCharts({ stats, paymentStats, eventActivity = [] }: DashboardChartsProps) {
    // Event status distribution
    const eventStatusData = [
        { name: 'Upcoming', value: stats.overview.upcomingEvents, color: '#0088FE' },
        { name: 'Past', value: stats.overview.pastEvents, color: '#00C49F' },
    ];

    // Payment status distribution
    const paymentStatusData = [
        { name: 'Paid', value: paymentStats.paidPayments, color: '#00C49F' },
        { name: 'Unpaid', value: paymentStats.unpaidPayments, color: '#FF8042' },
    ];

    const hasPaymentData = paymentStats.totalPayments > 0;
    const hasMonthlySpending = paymentStats.monthlySpending.length > 0;
    const hasEventActivity = eventActivity.length > 0;

    return (
        <div className="space-y-6">
            {/* Event Activity Timeline */}
            {hasEventActivity && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Event Activity
                        </CardTitle>
                        <CardDescription>
                            Events joined over the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={eventActivity}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="month"
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="events"
                                    stroke="#0088FE"
                                    strokeWidth={2}
                                    dot={{ fill: '#0088FE', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Monthly Spending Chart */}
            {hasMonthlySpending && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Monthly Spending
                                </CardTitle>
                                <CardDescription>
                                    Your spending on events over time
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">${paymentStats.totalSpent.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">Total spent</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={paymentStats.monthlySpending}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="month"
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                                />
                                <Bar dataKey="amount" fill="#0088FE" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Event Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Event Distribution
                        </CardTitle>
                        <CardDescription>
                            Upcoming vs Past Events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.overview.totalJoinedEvents > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={eventStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {eventStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex justify-center gap-6">
                                    {eventStatusData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {item.name}: {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                <p>No events yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Status Distribution */}
                {hasPaymentData ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Payment Status
                            </CardTitle>
                            <CardDescription>
                                Paid vs Unpaid Payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={paymentStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {paymentStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 flex justify-center gap-6">
                                {paymentStatusData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {item.name}: {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Payment Status
                            </CardTitle>
                            <CardDescription>
                                Payment information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                <p>No payments yet</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Event Type Distribution */}
                {paymentStats.eventTypeDistribution.length > 0 && (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Event Types
                            </CardTitle>
                            <CardDescription>
                                Distribution by event type
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={paymentStats.eventTypeDistribution}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        type="number"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        dataKey="type"
                                        type="category"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        width={100}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#8884d8" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
