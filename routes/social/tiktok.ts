import { Router } from "express";
import { tiktok_profile_scraper } from "../../controllers/social/tiktok/profile";
import { tiktok_comments_scraper } from "../../controllers/social/tiktok/comments";

const TikTokRouter = Router()

// TikTokRouter.post("/post", ig_post_scraper)
// TikTokRouter.post("/reel", ig_reel_scraper)
TikTokRouter.post("/profile", tiktok_profile_scraper)
TikTokRouter.post("/comments", tiktok_comments_scraper)
// TikTokRouter.post("/likes", ig_likes_scraper)
// TikTokRouter.post("/follow", ig_follow_scraper)
// TikTokRouter.post("/hashtag", ig_hashtag_scraper)


export default TikTokRouter