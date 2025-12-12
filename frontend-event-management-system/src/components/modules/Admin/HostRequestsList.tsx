"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HostRequest } from "@/services/admin/getAllHostRequests";
import { approveHostRequest, rejectHostRequest } from "@/services/admin/hostRequestActions";
import { Check, X, Loader2, UserCheck } from "lucide-react";

interface HostRequestsListProps {
    requests: HostRequest[];
}

export function HostRequestsList({ requests }: HostRequestsListProps) {
    const router = useRouter();
    const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);
    const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejectDialogOpen, setRejectDialogOpen] = useState<string | null>(null);

    const handleApprove = async (requestId: string) => {
        setApprovingRequestId(requestId);
        try {
            const result = await approveHostRequest(requestId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to approve host request");
        } finally {
            setApprovingRequestId(null);
        }
    };

    const handleReject = async (requestId: string) => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setRejectingRequestId(requestId);
        try {
            const result = await rejectHostRequest(requestId, rejectionReason);
            if (result.success) {
                toast.success(result.message);
                setRejectDialogOpen(null);
                setRejectionReason("");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to reject host request");
        } finally {
            setRejectingRequestId(null);
        }
    };

    if (requests.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-12">
                        <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No host requests found</h3>
                        <p className="text-muted-foreground">
                            No host requests match your current filters.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <Card key={request.id}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold">{request.name}</h3>
                                    <Badge
                                        variant={
                                            request.status === "APPROVED"
                                                ? "default"
                                                : request.status === "REJECTED"
                                                ? "destructive"
                                                : "secondary"
                                        }
                                        className="capitalize"
                                    >
                                        {request.status.toLowerCase()}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{request.email}</p>
                                {request.contactNumber && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Contact: {request.contactNumber}
                                    </p>
                                )}
                                {request.bio && (
                                    <p className="text-sm text-muted-foreground mb-2">{request.bio}</p>
                                )}
                                {request.location && (
                                    <p className="text-sm text-muted-foreground mb-2">{request.location}</p>
                                )}
                                {request.rejectionReason && (
                                    <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                        <p className="text-sm font-medium text-destructive mb-1">
                                            Rejection Reason:
                                        </p>
                                        <p className="text-sm text-muted-foreground">{request.rejectionReason}</p>
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {request.status === "PENDING" && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleApprove(request.id)}
                                        disabled={approvingRequestId === request.id}
                                    >
                                        {approvingRequestId === request.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Approving...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Approve
                                            </>
                                        )}
                                    </Button>
                                    <Dialog
                                        open={rejectDialogOpen === request.id}
                                        onOpenChange={(open) => {
                                            setRejectDialogOpen(open ? request.id : null);
                                            if (!open) setRejectionReason("");
                                        }}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={rejectingRequestId === request.id}
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Reject
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Reject Host Request</DialogTitle>
                                                <DialogDescription>
                                                    Please provide a reason for rejecting this host request.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="rejectionReason">Rejection Reason</Label>
                                                    <Textarea
                                                        id="rejectionReason"
                                                        placeholder="Enter the reason for rejection..."
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        rows={4}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setRejectDialogOpen(null);
                                                        setRejectionReason("");
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleReject(request.id)}
                                                    disabled={!rejectionReason.trim() || rejectingRequestId === request.id}
                                                >
                                                    {rejectingRequestId === request.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Rejecting...
                                                        </>
                                                    ) : (
                                                        "Reject Request"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

