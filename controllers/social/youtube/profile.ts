import axios from 'axios';
import { Request, Response } from "express";

export const yt_channel_details = async (req: Request, res: Response) => {
    const { channel } = req.body;
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!channel) {
        res.status(400).json({ error: "Please provide a channel ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/channel/details/',
        params: {
            id: channel,
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
        console.error("Error fetching YouTube channel details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};
