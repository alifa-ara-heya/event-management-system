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

interface EventStatisticsChartsProps {
    stats: EventStatistics;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function EventStatisticsCharts({ stats }: EventStatisticsChartsProps) {
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
                                    width={120}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#8884d8" radius={[0, 8, 8, 0]}>
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

