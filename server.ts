import express from "express"
import cors from "cors"
import { validateApifyApiKey } from "./middlewares/validateApiKey";
import InstagramRouter from "./routes/social/instagram";
import cookieParser from "cookie-parser";
import FacebookRouter from "./routes/social/facebook";
import YouTubeRouter from "./routes/social/youtube";
import TikTokRouter from "./routes/social/tiktok";
import XRouter from "./routes/social/x";
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(validateApifyApiKey)

app.use("/social/instagram", InstagramRouter)
app.use("/social/facebook", FacebookRouter)
app.use("/social/youtube", YouTubeRouter)
app.use("/social/tiktok", TikTokRouter)
app.use("/social/x", XRouter)


app.listen(process.env.PORT,()=>{
    console.log("Running")
})