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
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import { EventStatistics } from "@/services/admin/getEventStatistics";
import { useTheme } from "next-themes";
import { useMemo } from "react";

interface EventStatisticsChartsProps {
    stats: EventStatistics;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function EventStatisticsCharts({ stats }: EventStatisticsChartsProps) {
    const { resolvedTheme } = useTheme();

    // Determine if dark mode is active using useMemo to avoid re-renders
    const isDark = useMemo(() => {
        if (resolvedTheme === 'dark') return true;
        if (resolvedTheme === 'light') return false;
        // For 'system', check the media query
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    }, [resolvedTheme]);

    // Theme-aware colors - using darker colors for better contrast in light mode
    const textColor = isDark ? '#e5e7eb' : '#0f172a'; // Light gray for dark mode, very dark (almost black) for light mode
    const gridColor = isDark ? '#374151' : '#d1d5db'; // Dark gray for dark mode, light gray for light mode
    const axisLineColor = isDark ? '#4b5563' : '#9ca3af'; // Border color
    const tooltipBg = isDark ? '#1f2937' : '#ffffff';
    const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
    const tooltipText = isDark ? '#e5e7eb' : '#0f172a';
    // Status breakdown data
    const statusData = [
        { name: 'Open', value: stats.statusBreakdown.open, color: '#00C49F' },
        { name: 'Full', value: stats.statusBreakdown.full, color: '#FFBB28' },
        { name: 'Cancelled', value: stats.statusBreakdown.cancelled, color: '#FF8042' },
        { name: 'Completed', value: stats.statusBreakdown.completed, color: '#0088FE' },
    ];

    // Time breakdown data
    const timeData = [
        { name: 'Upcoming', value: stats.timeBreakdown.upcoming, color: '#00C49F' },
        { name: 'Past', value: stats.timeBreakdown.past, color: '#8884d8' },
    ];

    // Events by type (for bar chart)
    const eventsByTypeData = stats.eventsByType.map((item, index) => ({
        type: item.type.replace('_', ' '),
        count: item.count,
        color: COLORS[index % COLORS.length],
    }));

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Status Breakdown
                        </CardTitle>
                        <CardDescription>
                            Distribution of events by status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.totalEvents > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex flex-wrap justify-center gap-4">
                                    {statusData.map((item, index) => (
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
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                <p>No events yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Time Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Time Breakdown
                        </CardTitle>
                        <CardDescription>
                            Upcoming vs Past Events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.totalEvents > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={timeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {timeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex justify-center gap-6">
                                    {timeData.map((item, index) => (
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
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                <p>No events yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Events by Type */}
            {eventsByTypeData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Events by Type
                        </CardTitle>
                        <CardDescription>
                            Distribution of events across different types
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={eventsByTypeData}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis
                                    type="number"
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    axisLine={{ stroke: axisLineColor }}
                                    tickLine={{ stroke: axisLineColor }}
                                />
                                <YAxis
                                    dataKey="type"
                                    type="category"
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    axisLine={{ stroke: axisLineColor }}
                                    tickLine={{ stroke: axisLineColor }}
                                    width={120}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: tooltipBg,
                                        border: `1px solid ${tooltipBorder}`,
                                        borderRadius: '8px',
                                        color: tooltipText
                                    }}
                                    itemStyle={{ color: tooltipText }}
                                    labelStyle={{ color: tooltipText }}
                                />
                                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                    {eventsByTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

