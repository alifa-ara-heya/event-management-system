"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Payment } from "@/services/payment/getMyPayments";
import { cancelPayment } from "@/services/payment/cancelPayment";
import { Calendar, MapPin, DollarSign, X, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PaymentsListProps {
    payments: Payment[];
}

export function PaymentsList({ payments }: PaymentsListProps) {
    const router = useRouter();
    const [cancellingPaymentId, setCancellingPaymentId] = useState<string | null>(null);

    const handleCancelPayment = async (paymentId: string) => {
        setCancellingPaymentId(paymentId);
        try {
            const result = await cancelPayment(paymentId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel payment");
        } finally {
            setCancellingPaymentId(null);
        }
    };

    if (payments.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-12">
                        <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                        <p className="text-muted-foreground">
                            You haven't made any payments yet.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {payments.map((payment) => (
                <Card key={payment.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {payment.event.image && (
                            <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                                <Image
                                    src={payment.event.image}
                                    alt={payment.event.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 192px"
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-semibold">{payment.event.name}</h3>
                                        <Badge
                                            variant={payment.status === "PAID" ? "default" : "secondary"}
                                            className="capitalize"
                                        >
                                            {payment.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 shrink-0" />
                                            <span>
                                                {new Date(payment.event.date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 shrink-0" />
                                            <span>{payment.event.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary mb-1">
                                        ${payment.amount.toFixed(2)}
                                    </div>
                                    {payment.paidAt && (
                                        <p className="text-xs text-muted-foreground">
                                            Paid {new Date(payment.paidAt).toLocaleDateString()}
                                        </p>
                                    )}
                                    {!payment.paidAt && (
                                        <p className="text-xs text-muted-foreground">
                                            Created {new Date(payment.createdAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/events/${payment.event.id}`}>
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View Event
                                        </Link>
                                    </Button>
                                </div>
                                {payment.status === "UNPAID" && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={cancellingPaymentId === payment.id}
                                            >
                                                {cancellingPaymentId === payment.id ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Cancelling...
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="mr-2 h-4 w-4" />
                                                        Cancel Payment
                                                    </>
                                                )}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Cancel Payment?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to cancel this unpaid payment? This will remove
                                                    the payment record and you'll need to create a new payment to join this
                                                    event.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Keep Payment</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleCancelPayment(payment.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Cancel Payment
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

