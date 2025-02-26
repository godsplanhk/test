import { yt_channel_details } from "../../controllers/social/youtube/profile";
import { yt_video_scraper } from "../../controllers/social/youtube/video";
import { Router } from "express";
import { yt_search_scraper } from "../../controllers/social/youtube/search";
import { yt_comments_scraper } from "../../controllers/social/youtube/comments";
import { yt_email_finder } from "../../controllers/social/youtube/email";
import { yt_subscriptions } from "../../controllers/social/youtube/subscribers";
import { yt_videos_scraper } from "../../controllers/social/youtube/videos";

const YouTubeRouter = Router()

YouTubeRouter.post("/video", yt_video_scraper)
YouTubeRouter.post("/videos", yt_videos_scraper)
YouTubeRouter.post("/profile", yt_channel_details)
YouTubeRouter.post("/comments", yt_comments_scraper)
YouTubeRouter.post("/search", yt_search_scraper)
YouTubeRouter.post("/email", yt_email_finder)
YouTubeRouter.post("/subscribers", yt_subscriptions)


export default YouTubeRouter