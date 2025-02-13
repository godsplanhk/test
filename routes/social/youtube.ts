import { yt_profile_scraper } from "../../controllers/social/youtube/profile";
import { yt_comments_scraper } from "../../controllers/social/youtube/comments";
import { yt_video_scraper } from "../../controllers/social/youtube/video";
import { Router } from "express";
import { yt_search_scraper } from "../../controllers/social/youtube/search";

const YouTubeRouter = Router()

YouTubeRouter.post("/video", yt_video_scraper)
YouTubeRouter.post("/profile", yt_profile_scraper)
YouTubeRouter.post("/comments", yt_comments_scraper)
YouTubeRouter.post("/search", yt_search_scraper)


export default YouTubeRouter