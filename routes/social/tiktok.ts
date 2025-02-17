import { Router } from "express";
import { tiktok_profile_scraper } from "../../controllers/social/tiktok/profile";
import { tiktok_comments_scraper } from "../../controllers/social/tiktok/comments";
import { tiktok_hashtag_scraper } from "../../controllers/social/tiktok/hashtag";
import { tiktok_video_scraper } from "../../controllers/social/tiktok/video";
import { tiktok_email_scraper } from "../../controllers/social/tiktok/email";
import { tiktok_followers_scraper } from "../../controllers/social/tiktok/followers";
import { tiktok_following_scraper } from "../../controllers/social/tiktok/following";

const TikTokRouter = Router()

// TikTokRouter.post("/post", ig_post_scraper)
// TikTokRouter.post("/reel", ig_reel_scraper)
TikTokRouter.post("/profile", tiktok_profile_scraper)
TikTokRouter.post("/comments", tiktok_comments_scraper)
TikTokRouter.post("/hashtag", tiktok_hashtag_scraper)
TikTokRouter.post("/video", tiktok_video_scraper)
TikTokRouter.post("/email", tiktok_email_scraper)
TikTokRouter.post("/followers", tiktok_followers_scraper)
TikTokRouter.post("/following", tiktok_following_scraper)

// TikTokRouter.post("/hashtag", ig_hashtag_scraper)


export default TikTokRouter