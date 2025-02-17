import axios from 'axios';
import { Request, Response } from "express";

export const yt_video_scraper = async (req: Request, res: Response) => {
    const { video } = req.body; // Get video ID from request
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!video) {
        res.status(400).json({ error: "Please provide a video ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/video/details/',
        params: {
            id: video,
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
        return 
    } catch (error: any) {
        console.error("Error fetching video details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};
