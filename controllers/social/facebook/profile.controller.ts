import { ApifyClient } from "apify-client";
import axios from "axios";
import { Request, Response } from "express";

export const facebook_profile_scraper = async (req: Request, res: Response) => {
    const {url:profile} = req.body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!apiKey || !profile) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/profile/details_url',
        headers: {
            'x-rapidapi-key': apiKey,
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
    const apiKey = req.headers['x-api-key']
    
    if (!url || !apiKey) {
        res.status(400).json({ error: 'Profile URL is required' });
        return;
    }
    const client = new ApifyClient({
        token: apiKey as string,
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