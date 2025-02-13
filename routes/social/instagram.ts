import { ig_reel_scraper } from "../../controllers/social/instagram/reel";
import { ig_post_scraper } from "../../controllers/social/instagram/post";
import { ig_profile_scraper } from "../../controllers/social/instagram/profile";
import { ig_comment_scraper } from "../../controllers/social/instagram/comments";
import { ig_likes_scraper } from "../../controllers/social/instagram/likes";
import { ig_follow_scraper } from "../../controllers/social/instagram/followerFollowing";
import { ig_hashtag_scraper } from "../../controllers/social/instagram/hashtag";
import { Router } from "express";

const InstagramRouter = Router()

InstagramRouter.post("/post", ig_post_scraper)
InstagramRouter.post("/reel", ig_reel_scraper)
InstagramRouter.post("/profile", ig_profile_scraper)
InstagramRouter.post("/comments", ig_comment_scraper)
InstagramRouter.post("/likes", ig_likes_scraper)
InstagramRouter.post("/follow", ig_follow_scraper)
InstagramRouter.post("/hashtag", ig_hashtag_scraper)


export default InstagramRouter