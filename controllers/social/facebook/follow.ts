import { ApifyClient } from 'apify-client';
import { Request, Response } from 'express';

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
