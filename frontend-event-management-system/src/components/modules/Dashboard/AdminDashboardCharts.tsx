"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, Calendar, Activity, Users } from "lucide-react";

interface AdminDashboardChartsProps {
    stats: {
        overview: {
            totalUsers: number;
            totalHosts: number;
            totalEvents: number;
            totalPayments: number;
            activeUsers: number;
            activeHosts: number;
            activeEvents: number;
            pendingHostRequests: number;
            totalRevenue: number;
        };
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function AdminDashboardCharts({ stats }: AdminDashboardChartsProps) {
    // User vs Host distribution
    const userHostData = [
        { name: 'Users', value: stats.overview.totalUsers, color: '#0088FE' },
        { name: 'Hosts', value: stats.overview.totalHosts, color: '#00C49F' },
    ];

    // Active vs Inactive breakdown
    const activeData = [
        { name: 'Active Users', value: stats.overview.activeUsers, color: '#00C49F' },
        { name: 'Inactive Users', value: stats.overview.totalUsers - stats.overview.activeUsers, color: '#FF8042' },
    ];

    // Events status breakdown (if we had more data)
    const eventStatusData = [
        { name: 'Active Events', value: stats.overview.activeEvents, color: '#00C49F' },
        { name: 'Other Events', value: stats.overview.totalEvents - stats.overview.activeEvents, color: '#8884d8' },
    ];

    // Revenue and payments data
    const financialData = [
        { name: 'Total Revenue', value: stats.overview.totalRevenue, color: '#00C49F' },
        { name: 'Total Payments', value: stats.overview.totalPayments, color: '#0088FE' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* User vs Host Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            User Distribution
                        </CardTitle>
                        <CardDescription>
                            Users vs Hosts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.overview.totalUsers > 0 || stats.overview.totalHosts > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={userHostData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {userHostData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex justify-center gap-6">
                                    {userHostData.map((item, index) => (
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
                                <p>No data yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Active vs Inactive Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            User Status
                        </CardTitle>
                        <CardDescription>
                            Active vs Inactive Users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.overview.totalUsers > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={activeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {activeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex justify-center gap-6">
                                    {activeData.map((item, index) => (
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
                                <p>No users yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Events Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Events Status
                        </CardTitle>
                        <CardDescription>
                            Active vs Other Events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.overview.totalEvents > 0 ? (
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

                {/* Financial Overview */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Financial Overview
                                </CardTitle>
                                <CardDescription>
                                    Revenue and Payments
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">${stats.overview.totalRevenue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Total Revenue</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={financialData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="name"
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                                        if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
                                        return `$${value}`;
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => {
                                        if (typeof value === 'number') {
                                            return value.toLocaleString();
                                        }
                                        return value;
                                    }}
                                />
                                <Bar dataKey="value" fill="#0088FE" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

