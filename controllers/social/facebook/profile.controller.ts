import { ApifyClient } from "apify-client";
import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";

export const facebook_profile_scraper = async (req: Request, res: Response) => {
    const {url:profile} = req.body
     // API key from request headers

    if (!API_KEYS.FACEBOOK_API_KEY || !profile) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/profile/details_url',
        headers: {
            'x-rapidapi-key': API_KEYS.FACEBOOK_API_KEY,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        },
        params:{
            url:profile
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.profile});
        return;
    } catch (error: any) {
        console.error("Error fetching Facebook profile details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};

export const facebook_follow_scraper = async (req: Request, res: Response) => {
    
    const {url,limit,type} = req.body;
    
    if (!url || !API_KEYS.FACEBOOK_APIFY_API_KEY) {
        res.status(400).json({ error: 'Profile URL is required' });
        return;
    }
    const client = new ApifyClient({
        token: API_KEYS.FACEBOOK_APIFY_API_KEY as string,
    });

    const input = {
        "startUrls": [{ "url": url }],
        "resultsLimit": limit || 5,
        "followType": type
    };

    try {
        const run = await client.actor("apify/facebook-followers-following-scraper").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        res.status(200).json({ data: items });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};