import axios from 'axios';
import { Request, Response } from "express";

export const tiktok_videos_scraper = async (req: Request, res: Response) => {
    const { userId, count, cursor } = req.body; // Get parameters from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!userId) {
        res.status(400).json({ error: "Please provide a TikTok userId" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://tiktok-api23.p.rapidapi.com/api/user/posts',
        params: { secUid:userId, 
            ...(count && {count}),
            ...(cursor && {cursor})
         },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
        return;
    } catch (error: any) {
        console.error("Error fetching TikTok post details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
