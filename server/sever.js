import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';




const app = express();
const port = process.env.PORT || 4000 //if the port wont find the one on the .env file it'll run on 4000
connectDB();


//frontend link for react app
const allowedOrigins = [process.env.FRONTEND_URL || "https://frontend-beige-five-39.vercel.app"]

//middlewares
app.use(express.json());  //all the incoming requests will be parsed using json
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true})); //to connect the frontend and the backend. We use credentials: true so that we can send the cookies in response from the express app


//API Endpoints
app.get('/', (req,res)=>{
    res.send("API Working Fine");
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);



app.listen(port, ()=> console.log(`server started on PORT:${port}`));

