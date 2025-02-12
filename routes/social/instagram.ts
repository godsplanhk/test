import { ig_comment_scraper, ig_likes_scraper, ig_post_scraper, ig_profile_scraper, ig_reel_scraper } from "../../controllers/social/instagram";
import express, { Router } from "express";

const InstagramRouter = Router()

InstagramRouter.post("/post", ig_post_scraper)
InstagramRouter.post("/reel", ig_reel_scraper)
InstagramRouter.post("/profile", ig_profile_scraper)
InstagramRouter.post("/comments", ig_comment_scraper)
InstagramRouter.post("/likes", ig_likes_scraper)


export default InstagramRouter