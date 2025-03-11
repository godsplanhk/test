import axios from 'axios';
import { Request, Response } from "express";

export const tiktok_profile_scraper = async (req: Request, res: Response) => {
    const { username:uniqueId } = req.body; // Get TikTok username from request
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!uniqueId) {
        res.status(400).json({ error: "Please provide a TikTok username (uniqueId)" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://tiktok-api23.p.rapidapi.com/api/user/info',
        params: { uniqueId },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:{...response.data.userInfo.user, ...response.data.userInfo.stats}});
        return
    } catch (error: any) {
        console.error("Error fetching TikTok user info:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return
    }
};

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

export const tiktok_following_scraper = async (req: Request, res: Response) => {
    const { id:secUid, count = '30', cursor:minCursor = '0' } = req.body; // Get parameters from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!secUid) {
        res.status(400).json({ error: "Please provide a TikTok secUid" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://tiktok-api23.p.rapidapi.com/api/user/followings',
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

