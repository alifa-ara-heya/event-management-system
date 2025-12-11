import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { hostRoutes } from "../modules/host/host.routes";
import { eventRoutes } from "../modules/event/event.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { reviewRoutes } from "../modules/review/review.routes";
import { adminRoutes } from "../modules/admin/admin.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: '/host',
        route: hostRoutes
    },
    {
        path: '/event',
        route: eventRoutes
    },
    {
        path: '/payment',
        route: paymentRoutes
    },
    {
        path: '/review',
        route: reviewRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    }
]

moduleRoutes.forEach(route => {
    if (route.route) {
        router.use(route.path, route.route)
    }
})

export default router;