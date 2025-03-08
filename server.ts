import express, { NextFunction, Request, Response } from "express";
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
import EnrichmentRouter from "./routes/enrichement.routes"
import IndeedRouter from "./routes/job/indeed.routes";
import DatabaseRouter from "./routes/db/social.logs.routes";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API Routes
app.use("/social/instagram", InstagramRouter);
app.use("/social/facebook", FacebookRouter);
app.use("/social/youtube", YouTubeRouter);
app.use("/social/tiktok", TikTokRouter);
app.use("/social/x", XRouter);
app.use("/jobs/linkedin", LinkedinRouter);
app.use("/jobs/glassdoor", GlassdoorRouter);
app.use("/jobs/apollo", ApolloRouter);
app.use("/jobs/crunchbase", CrunchbaseRouter);
app.use("/enrichment", EnrichmentRouter);
app.use("/maps", MapsRouter);
app.use("/jobs/indeed", IndeedRouter);
app.use("/db", DatabaseRouter);

// Influencer Search Endpoint
app.post("/influencerSearch", searchInfluencers);

// Global Error Handler
// app.use((err:any, req:Request, res:Response, next:NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Internal Server Error" });
// });

// // Handle 404 Errors
// app.use((req, res) => {
//   res.status(404).json({ error: "Not Found" });
// });

// // Graceful Shutdown Handling
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// Start Server
const PORT = 5300;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
