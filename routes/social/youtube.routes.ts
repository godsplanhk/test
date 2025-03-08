import { Router } from "express";
import { yt_channel_details, yt_email_finder, yt_subscriptions } from "../../controllers/social/youtube/profile.controller";
import { yt_video_scraper, yt_videos_scraper, yt_comments_scraper } from "../../controllers/social/youtube/video.controller";
import { yt_search_scraper } from "../../controllers/social/youtube/yt.controller";

const YouTubeRouter = Router()

YouTubeRouter.post("/video", yt_video_scraper)
YouTubeRouter.post("/videos", yt_videos_scraper)
YouTubeRouter.post("/profile", yt_channel_details)
YouTubeRouter.post("/comments", yt_comments_scraper)
YouTubeRouter.post("/search", yt_search_scraper)
YouTubeRouter.post("/email", yt_email_finder)
YouTubeRouter.post("/subscribers", yt_subscriptions)


export default YouTubeRouter