import { facebook_follow_scraper } from "../../controllers/social/facebook/followerFollowing";
import { facebook_comment_scraper } from "../../controllers/social/facebook/comments";
import { Router } from "express";
import { facebook_profile_scraper } from "../../controllers/social/facebook/profile";
import { facebook_likes_scraper } from "../../controllers/social/facebook/likes";
import { facebook_post_scraper } from "../../controllers/social/facebook/post";

const FacebookRouter = Router()

FacebookRouter.post("/post", facebook_post_scraper)
// FacebookRouter.post("/reel", ig_reel_scraper)
FacebookRouter.post("/profile", facebook_profile_scraper)
FacebookRouter.post("/comments", facebook_comment_scraper)
FacebookRouter.post("/likes", facebook_likes_scraper)
FacebookRouter.post("/follow", facebook_follow_scraper)


export default FacebookRouter