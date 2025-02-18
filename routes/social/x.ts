import { Router } from "express";
import { x_profile_info } from "../../controllers/social/x.com/profile";
import { x_users_by_id } from "../../controllers/social/x.com/userById";
import { x_followers } from "../../controllers/social/x.com/followers";
import { x_following } from "../../controllers/social/x.com/following";
import { x_comments_api } from "../../controllers/social/x.com/comments";
import { x_tweet } from "../../controllers/social/x.com/tweet";
import { x_hashtags } from "../../controllers/social/x.com/hashtags";
import { x_retweets } from "../../controllers/social/x.com/retweets";

const XRouter = Router()

// XRouter.post("/video", yt_video_scraper)
XRouter.post("/profile", x_profile_info)
XRouter.post("/by_id", x_users_by_id)
XRouter.post("/followers", x_followers)
XRouter.post("/following", x_following)
XRouter.post("/comments", x_comments_api)
XRouter.post("/tweet", x_tweet)
XRouter.post("/hashtag", x_hashtags)
XRouter.post("/retweets", x_retweets)
// XRouter.post("/search", yt_search_scraper)
// XRouter.post("/email", yt_email_finder)


export default XRouter