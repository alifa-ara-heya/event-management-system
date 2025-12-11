import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus, EventStatus } from "@prisma/client";
import { stripe } from "../../helpers/stripe";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { calculatePagination } from "../../helpers/paginationHelper";

/**
 * Create payment intent / checkout session for joining an event
 */
const createPaymentIntent = async (user: IJWTPayload, eventId: string) => {
    // Verify event exists and is available
    const event = await prisma.event.findUniqueOrThrow({
        where: { id: eventId, isDeleted: false }
    });

    // Check if event is open for joining
    if (event.status !== EventStatus.OPEN) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Event is ${event.status.toLowerCase()}. Cannot join.`);
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Event is full. Cannot join.");
    }

    // Check if user already joined
    const existingParticipant = await prisma.eventParticipant.findUnique({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: user.email
            }
        }
    });

    if (existingParticipant && !existingParticipant.isDeleted) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You have already joined this event.");
    }

    // Check if there's an existing unpaid payment
    const existingPayment = await prisma.payment.findFirst({
        where: {
            eventId: eventId,
            userId: user.email,
            status: PaymentStatus.UNPAID
        }
    });

    if (existingPayment) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You have an unpaid payment for this event. Please complete it first.");
    }

    // If event is free, directly add participant
    if (event.joiningFee === 0) {
        const result = await prisma.$transaction(async (tnx) => {
            // Create participant record
            const participant = await tnx.eventParticipant.upsert({
                where: {
                    eventId_userId: {
                        eventId: eventId,
                        userId: user.email
                    }
                },
                update: {
                    isDeleted: false
                },
                create: {
                    eventId: eventId,
                    userId: user.email
                }
            });

            // Update event participant count
            const updatedEvent = await tnx.event.update({
                where: { id: eventId },
                data: {
                    currentParticipants: {
                        increment: 1
                    },
                    status: event.currentParticipants + 1 >= event.maxParticipants
                        ? EventStatus.FULL
                        : EventStatus.OPEN
                }
            });

            return { participant, event: updatedEvent };
        });

        return {
            success: true,
            message: "Successfully joined the event (free event)",
            participant: result.participant,
            event: result.event
        };
    }

    // Create payment record
    const payment = await prisma.payment.create({
        data: {
            eventId: eventId,
            userId: user.email,
            amount: event.joiningFee,
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: PaymentStatus.UNPAID
        }
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: event.name,
                        description: event.description || `Join ${event.name} on ${new Date(event.date).toLocaleDateString()}`,
                        images: event.image ? [event.image] : []
                    },
                    unit_amount: Math.round(event.joiningFee * 100) // Convert to cents
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment/cancel`,
        metadata: {
            eventId: eventId,
            userId: user.email,
            paymentId: payment.id
        }
    });

    // Update payment with session ID
    await prisma.payment.update({
        where: { id: payment.id },
        data: {
            transactionId: session.id,
            paymentGatewayData: session as any
        }
    });

    return {
        success: true,
        message: "Payment session created successfully",
        paymentId: payment.id,
        checkoutUrl: session.url,
        sessionId: session.id
    };
};

/**
 * Handle Stripe webhook events
 */
const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    console.log(`🔄 Processing webhook event: ${event.type}`);

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            console.log("📋 Session details:", {
                id: session.id,
                payment_status: session.payment_status,
                status: session.status,
                metadata: session.metadata
            });

            const eventId = session.metadata?.eventId;
            const userId = session.metadata?.userId;
            const paymentId = session.metadata?.paymentId;

            if (!eventId || !userId || !paymentId) {
                console.error("❌ Missing metadata in webhook event:", session.metadata);
                return;
            }

            console.log("🔍 Processing payment:", { paymentId, eventId, userId });

            // Update payment status
            const updatedPayment = await prisma.payment.update({
                where: {
                    id: paymentId
                },
                data: {
                    status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                    paymentGatewayData: session as any,
                    paidAt: session.payment_status === "paid" ? new Date() : null
                }
            });

            console.log(`✅ Payment updated: ${paymentId} -> ${updatedPayment.status}`);

            // If payment is successful, add participant and update event
            if (session.payment_status === "paid") {
                console.log("💰 Payment successful, adding participant...");
                await prisma.$transaction(async (tnx) => {
                    // Check if participant already exists
                    const existingParticipant = await tnx.eventParticipant.findUnique({
                        where: {
                            eventId_userId: {
                                eventId: eventId,
                                userId: userId
                            }
                        }
                    });

                    // Create or restore participant record
                    if (existingParticipant) {
                        await tnx.eventParticipant.update({
                            where: { id: existingParticipant.id },
                            data: { isDeleted: false }
                        });
                    } else {
                        await tnx.eventParticipant.create({
                            data: {
                                eventId: eventId,
                                userId: userId
                            }
                        });
                    }

                    // Get current event state
                    const event = await tnx.event.findUniqueOrThrow({
                        where: { id: eventId }
                    });

                    // Update event participant count and status
                    await tnx.event.update({
                        where: { id: eventId },
                        data: {
                            currentParticipants: {
                                increment: 1
                            },
                            status: event.currentParticipants + 1 >= event.maxParticipants
                                ? EventStatus.FULL
                                : EventStatus.OPEN
                        }
                    });

                    // Update host revenue
                    await tnx.host.update({
                        where: { id: event.hostId },
                        data: {
                            totalRevenue: {
                                increment: event.joiningFee
                            }
                        }
                    });
                });
                console.log("✅ Participant added and event updated");
            } else {
                console.log(`⚠️ Payment status is: ${session.payment_status}`);
            }

            break;
        }
        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
};

/**
 * Get payment by ID
 */
const getPaymentById = async (paymentId: string, user: IJWTPayload) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: { id: paymentId },
        include: {
            event: {
                select: {
                    id: true,
                    name: true,
                    date: true,
                    location: true,
                    joiningFee: true
                }
            }
        }
    });

    // Verify user owns this payment
    if (payment.userId !== user.email) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can only view your own payments.");
    }

    return payment;
};

/**
 * Get my payments (User only)
 */
const getMyPayments = async (user: IJWTPayload, params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { status, ...filterData } = params;

    const andConditions: any[] = [
        { userId: user.email }
    ];

    if (status) {
        andConditions.push({ status: status as PaymentStatus });
    }

    const whereConditions = { AND: andConditions };

    const result = await prisma.payment.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            event: {
                select: {
                    id: true,
                    name: true,
                    date: true,
                    location: true,
                    image: true
                }
            }
        }
    });

    const total = await prisma.payment.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: result
    };
};

export const PaymentService = {
    createPaymentIntent,
    handleStripeWebhookEvent,
    getPaymentById,
    getMyPayments
};

