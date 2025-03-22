import cluster from "node:cluster";
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
import ApolloRouter from "./routes/job/apollo.routes";
import MapsRouter from "./routes/maps.routes";
import CrunchbaseRouter from "./routes/job/crunchbase.routes";
import { searchInfluencers } from "./controllers/social/influencer.controller";
import EnrichmentRouter from "./routes/enrichement.routes";
import DatabaseRouter from "./routes/db/social.logs.routes";
import authMiddleware from "./middleware/auth.middleware";
import JobSearch from "./routes/job/jobsearch.routes";

dotenv.config();

  const app = express();

  // Middlewares
  const corsOptions ={
    origin:"*",
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
  }
  app.options('*', cors()) // include before other routes
  app.use(cors(corsOptions));

  app.use(helmet());
  app.use(compression());
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(express.json({ limit: "50mb" }));
  app.use(morgan("combined"));
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);

  // Social API Routes
  app.use("/social/instagram", authMiddleware, InstagramRouter);
  app.use("/social/facebook", authMiddleware, FacebookRouter);
  app.use("/social/youtube", authMiddleware, YouTubeRouter);
  app.use("/social/tiktok", authMiddleware, TikTokRouter);
  app.use("/social/x", authMiddleware, XRouter);

  // Jobs API
  app.use("/jobs/linkedin", authMiddleware, LinkedinRouter);
  app.use("/jobs/apollo", authMiddleware, ApolloRouter);
  app.use("/jobs/crunchbase", authMiddleware, CrunchbaseRouter);
  app.use("/jobs/search", authMiddleware, JobSearch);

  // Enrichment, Maps, and DB
  app.use("/enrichment", authMiddleware, EnrichmentRouter);
  app.use("/maps", authMiddleware, MapsRouter);
  app.use("/db", authMiddleware, DatabaseRouter);

  // Influencer API
  app.post("/influencerSearch", authMiddleware, searchInfluencers);

  const PORT = process.env.PORT || 5300;
  app.listen(PORT);

