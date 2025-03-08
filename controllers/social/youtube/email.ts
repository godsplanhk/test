import axios from 'axios';
import { Request, Response } from "express";

export const yt_email_finder = async (req: Request, res: Response) => {
    const { channelId } = req.body;
    const apiKey = req.headers["x-api-key"] as string; // Using API key from request headers

    if (!channelId) {
        res.status(400).json({ error: "Please provide a channel ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: `https://youtube-email-finder.p.rapidapi.com/youtube/channel_id/${channelId}`,
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube-email-finder.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.data.email[0]});
    } catch (error: any) {
        console.error("Error fetching YouTube email:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
    }
};
