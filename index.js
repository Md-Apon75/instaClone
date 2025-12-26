import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoute.js'
import postRouter from './routes/postRoutes.js'
import loopRouter from './routes/loopRoute.js'
import storyRouter from './routes/storyRoute.js'
dotenv.config()
const app = express()
app.use(cors({
    origin: ["https://instaclone-4-f0p8.onrender.com/", "http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/loop",loopRouter)
app.use("/api/story",storyRouter)
const port = process.env.PORT || 6000
app.listen(port,()=>{
    connectDb()
    console.log(`server is started from ${port}`)
})

	
