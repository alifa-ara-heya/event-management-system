import express from "express";
import { userRoutes } from "../modules/user/user.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: "/auth",
        // route: authRoutes
    },
    {
        path: '/event',
        // route: eventRoutes
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