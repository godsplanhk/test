import express from "express"
import cors from "cors"
import InstagramRouter from "./routes/social/instagram";
import FacebookRouter from "./routes/social/facebook";
import YouTubeRouter from "./routes/social/youtube";
import TikTokRouter from "./routes/social/tiktok";
import XRouter from "./routes/social/x";
import dotenv from 'dotenv'
import LinkedinRouter from "./routes/job/linkedin";
import { searchDiceJobs } from "./controllers/job/dice";
import GlassdoorRouer from "./routes/job/glassdoor";
import { scrapeNaukriJobs } from "./controllers/job/naukri";
import { scrapeIndeedJobs } from "./controllers/job/indeed";
import ApolloRouter from "./routes/job/apollo";
import MapsRouter from "./routes/googleMaps";

dotenv.config()

const app = express();

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use("/social/instagram", InstagramRouter)
app.use("/social/facebook", FacebookRouter)
app.use("/social/youtube", YouTubeRouter)
app.use("/social/tiktok", TikTokRouter)
app.use("/social/x", XRouter)

app.use("/jobs/linkedin", LinkedinRouter)
app.use("/jobs/indeed", scrapeIndeedJobs)
app.use("/jobs/dice", searchDiceJobs)
app.use("/jobs/glassdoor", GlassdoorRouer)
app.post("/jobs/naukri", scrapeNaukriJobs)
app.use("/jobs/apollo", ApolloRouter)
app.use("/maps", MapsRouter)


app.listen(process.env.PORT,()=>{
})