import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRouter.js";
import aiRouter from "./routes/aiRoute.js";
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())
await connectDB()
app.get('/' ,(req, res)=>
    res.send("Server is line...")
)
app.use('/api/user',userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai',aiRouter)
app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
    
})