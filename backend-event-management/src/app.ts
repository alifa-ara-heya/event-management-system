import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import config from './config';
// import routes from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import notFound from './app/middlewares/notFound';


const app: Application = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Welcome from Health care server..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " seconds",
        timeStamp: new Date().toISOString()
    })
});

// Application routes
app.use('/api/v1', router);

// Global error handler
app.use(globalErrorHandler);

app.use(notFound);

export default app;
