import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import InstagramRouter from "./routes/social/instagram.routes";
import FacebookRouter from "./routes/social/facebook.routes";
import YouTubeRouter from "./routes/social/youtube.routes";
import TikTokRouter from "./routes/social/tiktok.routes";
import XRouter from "./routes/social/x.routes";
import LinkedinRouter from "./routes/job/linkedin.routes";
import GlassdoorRouter from "./routes/job/glassdoor.routes";
import ApolloRouter from "./routes/job/apollo.routes";
import MapsRouter from "./routes/maps.routes";
import CrunchbaseRouter from "./routes/job/crunchbase.routes";
import { searchInfluencers } from "./controllers/social/influencer.controller";
import EnrichmentRouter from "./routes/enrichement.routes";
import IndeedRouter from "./routes/job/indeed.routes";
import DatabaseRouter from "./routes/db/social.logs.routes";
import authMiddleware from "./middleware/auth.middleware";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true, limit:"50mb" }));
app.use(express.json({limit:"50mb"}));
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Social API Routes
app.use("/social/instagram", InstagramRouter);
app.use("/social/facebook", FacebookRouter);
app.use("/social/youtube", YouTubeRouter);
app.use("/social/tiktok", TikTokRouter);
app.use("/social/x", XRouter);

// Jobs API
app.use("/jobs/linkedin", LinkedinRouter);
app.use("/jobs/glassdoor", GlassdoorRouter);
app.use("/jobs/apollo", ApolloRouter);
app.use("/jobs/crunchbase", CrunchbaseRouter);
app.use("/jobs/indeed", IndeedRouter);

// Enrichement, Maps and DB
app.use("/enrichment", EnrichmentRouter);
app.use("/maps", MapsRouter);
app.use("/db", DatabaseRouter);

// Influencer API
app.post("/influencerSearch", searchInfluencers);


const PORT = process.env.PORT || 5300;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
