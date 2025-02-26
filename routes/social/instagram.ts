import { ig_post_scraper } from "../../controllers/social/instagram/post";
import { ig_profile_scraper } from "../../controllers/social/instagram/profile";
import { ig_comment_scraper } from "../../controllers/social/instagram/comments";
import { ig_likes_scraper } from "../../controllers/social/instagram/likes";
import { ig_followers_scraper } from "../../controllers/social/instagram/followers";
import { ig_hashtag_scraper } from "../../controllers/social/instagram/hashtag";
import { ig_following_scraper } from "../../controllers/social/instagram/following";
import { Router } from "express";
import { ig_id_generator } from "../../controllers/social/instagram/id";
import { ig_posts_scraper } from "../../controllers/social/instagram/posts";

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


export default InstagramRouter