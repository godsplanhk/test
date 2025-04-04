import { Router } from "express";
import { ig_comment_scraper, ig_likes_scraper, ig_post_scraper, ig_posts_scraper } from "../../controllers/social/instagram/posts.controller";
import { ig_hashtag_scraper, ig_id_generator, ig_search } from "../../controllers/social/instagram/ig.controller";
import { ig_followers_scraper, ig_following_scraper, ig_profile_scraper } from "../../controllers/social/instagram/profile.controller";

const InstagramRouter = Router()

InstagramRouter.post("/post", ig_post_scraper)
InstagramRouter.post("/posts", ig_posts_scraper)
InstagramRouter.post("/id", ig_id_generator)
InstagramRouter.post("/profile", ig_profile_scraper)
InstagramRouter.post("/comments", ig_comment_scraper)
InstagramRouter.post("/likes", ig_likes_scraper)
InstagramRouter.post("/followers", ig_followers_scraper)
InstagramRouter.post("/following", ig_following_scraper)
InstagramRouter.post("/hashtag", ig_hashtag_scraper)
InstagramRouter.post("/search", ig_search)


export default InstagramRouter