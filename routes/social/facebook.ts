import { facebook_follow_scraper } from "../../controllers/social/facebook/follow";
import { facebook_comment_scraper } from "../../controllers/social/facebook/comments";
import { Router } from "express";
import { facebook_profile_scraper } from "../../controllers/social/facebook/profile";
import { facebook_likes_scraper } from "../../controllers/social/facebook/likes";
import { facebook_post_scraper } from "../../controllers/social/facebook/post";
import { facebook_page_details } from "../../controllers/social/facebook/pages";
import { facebook_search } from "../../controllers/social/facebook/search";
import { facebook_group_details } from "../../controllers/social/facebook/group";
import { facebook_posts_scraper } from "../../controllers/social/facebook/posts";

const FacebookRouter = Router()

FacebookRouter.post("/post", facebook_post_scraper)
FacebookRouter.post("/posts", facebook_posts_scraper)
FacebookRouter.post("/page", facebook_page_details)
FacebookRouter.post("/search", facebook_search)
FacebookRouter.post("/group", facebook_group_details)
// FacebookRouter.post("/reel", ig_reel_scraper)
FacebookRouter.post("/profile", facebook_profile_scraper)
FacebookRouter.post("/comments", facebook_comment_scraper)
FacebookRouter.post("/likes", facebook_likes_scraper)
FacebookRouter.post("/follow", facebook_follow_scraper)


export default FacebookRouter