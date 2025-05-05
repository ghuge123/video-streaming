import dotenv from 'dotenv';
import connectDB from './db/db.js';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
const app = express();

dotenv.config();
app.use(cors({
    origin: 'http://localhost:5173', // your frontend Vite app
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

// Route setup
import userRouter from './routes/user.route.js'
import videoRoute from './routes/video.route.js'
import likeRoute from './routes/like.route.js'
import commentRoute from './routes/comment.route.js'
import playlistRoute from './routes/playlist.route.js'
import tweetRoute from './routes/tweet.route.js'
import subscriberRoute from './routes/subscription.route.js'
import watchHistoryRoute from './routes/watchHistory.route.js';

app.use("/api/v1/user" , userRouter);
app.use("/api/v1/videos" , videoRoute);
app.use("/api/v1/likes" , likeRoute);
app.use("/api/v1/comments" , commentRoute);
app.use("/api/v1/playlist" , playlistRoute);
app.use("/api/v1/tweets" , tweetRoute);
app.use("/api/v1/subscribers" , subscriberRoute);
app.use("/api/v1/history" , watchHistoryRoute)



connectDB()
.then(()=>{
    app.listen(8080 , ()=>{
        console.log("hello");
    })
})
.catch((err)=> console.error("MONGODB CONNECTION FAILED" , err));
