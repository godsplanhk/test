import axios from 'axios';
import { Request, Response } from "express";

export const tiktok_followers_scraper = async (req: Request, res: Response) => {
    const { id:secUid, count = '30', cursor:minCursor = '0' } = req.body; // Get parameters from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!secUid) {
        res.status(400).json({ error: "Please provide a TikTok secUid" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://tiktok-api23.p.rapidapi.com/api/user/followers',
        params: { secUid, count, minCursor },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.userList});
        return;
    } catch (error: any) {
        console.error("Error fetching TikTok followers:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
