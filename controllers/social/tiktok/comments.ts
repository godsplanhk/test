import axios from 'axios';
import { Request, Response } from "express";

export const tiktok_comments_scraper = async (req: Request, res: Response) => {
    const { videoId, count = '50', cursor = '0' } = req.body; // Get parameters from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!videoId) {
        res.status(400).json({ error: "Please provide a TikTok videoId" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://tiktok-api23.p.rapidapi.com/api/post/comments',
        params: { videoId, count, cursor },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.comments});
        return;
    } catch (error: any) {
        console.error("Error fetching TikTok post comments:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
