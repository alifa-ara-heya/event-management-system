import express from "express";

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        // route: userRoutes
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

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;