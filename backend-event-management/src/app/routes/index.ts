import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { hostRoutes } from "../modules/host/host.routes";
import { eventRoutes } from "../modules/event/event.routes";

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
        // route: paymentRoutes
    },
    {
        path: '/admin',
        // route: admin Routes
    }
]

moduleRoutes.forEach(route => {
    if (route.route) {
        router.use(route.path, route.route)
    }
})

export default router;