import { Router } from "express";
import { tiktok_followers_scraper, tiktok_following_scraper, tiktok_profile_scraper } from "../../controllers/social/tiktok/profile.controller";
import { tiktok_hashtag_scraper, tiktok_email_scraper } from "../../controllers/social/tiktok/tiktok.controller";
import { tiktok_comments_scraper, tiktok_video_scraper, tiktok_videos_scraper } from "../../controllers/social/tiktok/video.controller";

const TikTokRouter = Router()

TikTokRouter.post("/profile", tiktok_profile_scraper)
TikTokRouter.post("/comments", tiktok_comments_scraper)
TikTokRouter.post("/hashtag", tiktok_hashtag_scraper)
TikTokRouter.post("/video", tiktok_video_scraper)
TikTokRouter.post("/videos", tiktok_videos_scraper)
TikTokRouter.post("/email", tiktok_email_scraper)
TikTokRouter.post("/followers", tiktok_followers_scraper)
TikTokRouter.post("/following", tiktok_following_scraper)




export default TikTokRouter