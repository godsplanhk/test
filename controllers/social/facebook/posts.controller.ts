import { ApifyClient } from "apify-client";
import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";

export const facebook_single_post_scraper = async (req:Request, res:Response) => {
    const postId = req.body.post_id;
     // API key from request headers

    if (!postId || !API_KEYS.FACEBOOK_API_KEY) {
        res.status(400).json({ error: 'post_id query parameter is required' });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/post',
        params: { post_id: postId },
        headers: {
            'x-rapidapi-key': API_KEYS.FACEBOOK_API_KEY,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.results});
    } catch (error:any) {
        res.status(error.status || 500).json({ error: error.message });
    }
};


export const facebook_profile_posts_scraper = async (req:Request, res:Response) => {
    const {profile_id, cursor, start_date, end_date} = req.body;
     // API key from request headers

    if (!profile_id || !API_KEYS.FACEBOOK_API_KEY) {
        res.status(400).json({ error: 'post_id query parameter is required' });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/profile/posts',
        params: { profile_id, 
            ...(cursor && {cursor}),
            ...(start_date && {start_date}),
            ...(end_date && {end_date}),
        },
        headers: {
            'x-rapidapi-key': API_KEYS.FACEBOOK_API_KEY,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.results});
    } catch (error:any) {
        res.status(error.status || 500).json({ error: error.message });
    }
};


export const facebook_likes_scraper = async (req: Request, res: Response) => {
    
    const {url,limit,} = req.body;
    
    if (!url || !API_KEYS.FACEBOOK_APIFY_API_KEY) {
        res.status(400).json({ error: 'Profile URL is required' });
        return;
    }
    const client = new ApifyClient({
        token: API_KEYS.FACEBOOK_APIFY_API_KEY as string,
    });

    const input = {
        "startUrls": [{ "url": url }],
        "resultsLimit": limit || 10
    };

    try {
        const run = await client.actor("apify/facebook-likes-scraper").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        res.status(200).json({ data: items });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const facebook_comments_scraper = async (req: Request, res: Response) => {
    const { id, limit, cursor } = req.body;
    

    if (!id) {
        res.status(400).json({ "error": "Please provide the post_id" });
        return;
    }
    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/post/comments',
        params: {post_id:id, ...(cursor && {cursor})},
        headers: {
            'x-rapidapi-key': API_KEYS.FACEBOOK_API_KEY,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    const regex = /(?:facebook\.com\/(?:people\/)?)([a-zA-Z0-9.-]+)/;

    try {
        const response = await axios.request(options);
        
        res.status(200).json({ data:response.data.results.slice(0,limit?limit:2), cursor:response.data.cursor });
    } catch (error:any) {
        res.status(error?.status)
    }
};

