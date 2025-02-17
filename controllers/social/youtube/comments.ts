import axios from 'axios';
import { Request, Response } from "express";

export const yt_comments_scraper = async (req: Request, res: Response) => {
    const { video, limit, cursor } = req.body;
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!video) {
        res.status(400).json({ error: "Please provide a video ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/video/comments/',
        params: {
            id: video,
            ...(cursor && {cursor})
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({comments:response.data?.comments.slice(0, limit || 2), next:response?.data.cursorNext});
        return 
    } catch (error: any) {
        console.error("Error fetching YouTube video comments:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};
