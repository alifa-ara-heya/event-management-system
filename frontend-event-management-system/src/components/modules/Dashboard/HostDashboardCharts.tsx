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
import { Calendar, TrendingUp, DollarSign, Users, Star } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo } from "react";

interface HostDashboardChartsProps {
    stats: {
        overview: {
            totalEvents: number;
            upcomingEvents: number;
            pastEvents: number;
            totalParticipants: number;
            totalRevenue: number;
            averageRating: number;
            totalReviews: number;
        };
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function HostDashboardCharts({ stats }: HostDashboardChartsProps) {
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
    
    // Theme-aware colors
    const textColor = isDark ? '#e5e7eb' : '#0f172a';
    const gridColor = isDark ? '#374151' : '#d1d5db';
    const axisLineColor = isDark ? '#4b5563' : '#9ca3af';
    const tooltipBg = isDark ? '#1f2937' : '#ffffff';
    const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
    const tooltipText = isDark ? '#e5e7eb' : '#0f172a';

    // Events timeline breakdown
    const eventsTimelineData = [
        { name: 'Upcoming', value: stats.overview.upcomingEvents, color: '#00C49F' },
        { name: 'Past', value: stats.overview.pastEvents, color: '#8884d8' },
    ];

    // Revenue visualization (if we have revenue data)
    const revenueData = [
        { name: 'Total Revenue', value: stats.overview.totalRevenue, color: '#00C49F' },
    ];

    // Events vs Participants comparison
    const eventsParticipantsData = [
        { name: 'Total Events', value: stats.overview.totalEvents, color: '#0088FE' },
        { name: 'Total Participants', value: stats.overview.totalParticipants, color: '#FFBB28' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Events Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Events Timeline
                        </CardTitle>
                        <CardDescription>
                            Upcoming vs Past Events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.overview.totalEvents > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={eventsTimelineData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {eventsTimelineData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
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
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex justify-center gap-6">
                                    {eventsTimelineData.map((item, index) => (
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

                {/* Events vs Participants */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Events & Participants
                        </CardTitle>
                        <CardDescription>
                            Total Events vs Total Participants
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.overview.totalEvents > 0 || stats.overview.totalParticipants > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={eventsParticipantsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: textColor, fontSize: 12 }}
                                            axisLine={{ stroke: axisLineColor }}
                                            tickLine={{ stroke: axisLineColor }}
                                        />
                                        <YAxis
                                            tick={{ fill: textColor, fontSize: 12 }}
                                            axisLine={{ stroke: axisLineColor }}
                                            tickLine={{ stroke: axisLineColor }}
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
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {eventsParticipantsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                <p>No data yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Revenue Overview */}
                {stats.overview.totalRevenue > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Revenue Overview
                                    </CardTitle>
                                    <CardDescription>
                                        Total Earnings
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
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: textColor, fontSize: 12 }}
                                        axisLine={{ stroke: axisLineColor }}
                                        tickLine={{ stroke: axisLineColor }}
                                    />
                                    <YAxis
                                        tick={{ fill: textColor, fontSize: 12 }}
                                        axisLine={{ stroke: axisLineColor }}
                                        tickLine={{ stroke: axisLineColor }}
                                        tickFormatter={(value) => {
                                            if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                                            if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
                                            return `$${value}`;
                                        }}
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
                                        formatter={(value: number) => {
                                            if (typeof value === 'number') {
                                                return `$${value.toLocaleString()}`;
                                            }
                                            return value;
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#00C49F" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Rating & Reviews */}
                {stats.overview.totalReviews > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Rating & Reviews
                                    </CardTitle>
                                    <CardDescription>
                                        Average Rating from Reviews
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        {stats.overview.averageRating.toFixed(1)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.overview.totalReviews} reviews
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-[250px]">
                                <div className="text-center">
                                    <div className="text-6xl font-bold mb-2">
                                        {stats.overview.averageRating.toFixed(1)}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-6 w-6 ${
                                                    star <= Math.round(stats.overview.averageRating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Based on {stats.overview.totalReviews} {stats.overview.totalReviews === 1 ? 'review' : 'reviews'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

