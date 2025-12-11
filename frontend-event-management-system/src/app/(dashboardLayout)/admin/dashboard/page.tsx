import { getAdminDashboardStats } from "@/services/dashboard/getAdminDashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, Calendar, CreditCard, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

async function AdminDashboardContent() {
    const stats = await getAdminDashboardStats();

    return (
        <div className="space-y-6">
            {/* Stats Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.overview.activeUsers} active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalHosts}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.overview.activeHosts} active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.overview.activeEvents} active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.overview.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Platform revenue</p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalPayments}</div>
                        <p className="text-xs text-muted-foreground">All transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Host Requests</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.pendingHostRequests}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Events */}
            {stats.recentEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Events</CardTitle>
                        <CardDescription>Latest events on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/admin/events/${event.id}`}
                                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                                >
                                    {event.image && (
                                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={event.image}
                                                alt={event.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{event.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString()} • {event.location}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                            <span>Host: {event.host.name}</span>
                                            <span>{event._count.participants} participants</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Users */}
            {stats.recentUsers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                        <CardDescription>Latest registered users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{user.name}</h3>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                            <span className="capitalize">{user.role.toLowerCase()}</span>
                                            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const AdminDashboardPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your event management system statistics
                </p>
            </div>

            <Suspense fallback={<DashboardSkeleton />}>
                <AdminDashboardContent />
            </Suspense>
        </div>
    );
};

export default AdminDashboardPage;

