import axios from 'axios';
import { Request, Response } from "express";

export const yt_videos_scraper = async (req: Request, res: Response) => {
    const { channel, filter, cursor } = req.body; // Get video ID from request
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!channel) {
        res.status(400).json({ error: "Please provide a video ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/channel/videos/',
        params: {
            id: channel,
            ...(filter && {filter}),
            ...(cursor && {cursor})
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
