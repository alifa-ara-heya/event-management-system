import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import config from './config';


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

export default app;
