import { Router } from "express";
import { facebook_comments_scraper, facebook_likes_scraper, facebook_profile_posts_scraper, facebook_single_post_scraper } from "../../controllers/social/facebook/posts.controller";
import { facebook_follow_scraper, facebook_profile_scraper } from "../../controllers/social/facebook/profile.controller";
import { facebook_group_scraper, facebook_page_scraper, facebook_search } from "../../controllers/social/facebook/fb.controller";

const FacebookRouter = Router()

FacebookRouter.post("/post", facebook_single_post_scraper)
FacebookRouter.post("/posts", facebook_profile_posts_scraper)
FacebookRouter.post("/page", facebook_page_scraper)
FacebookRouter.post("/search", facebook_search)
FacebookRouter.post("/group", facebook_group_scraper)
FacebookRouter.post("/profile", facebook_profile_scraper)
FacebookRouter.post("/comments", facebook_comments_scraper)
FacebookRouter.post("/likes", facebook_likes_scraper)
FacebookRouter.post("/follow", facebook_follow_scraper)


export default FacebookRouter