import { Router } from "express";
import { x_profile_info, x_followers, x_following } from "../../controllers/social/x.com/profile.controller";
import { x_comments_api, x_tweet, x_retweets } from "../../controllers/social/x.com/tweets.controller";
import { x_users_by_id, x_hashtags } from "../../controllers/social/x.com/x.controller";

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