import axios from 'axios';
import { Request, Response } from "express";

export const tiktok_email_scraper = async (req: Request, res: Response) => {
    const {username} = req.body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!apiKey || !username) {
        res.status(400).json({ error: "Please provide an API key and username." });
        return;
    }

    const options = {
        method: 'GET',
        url: `https://tiktok-email-contact-finder.p.rapidapi.com/tiktok/${username}`,
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'tiktok-email-contact-finder.p.rapidapi.com'
        },
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({email:response.data.data.email[0]});
        return;
    } catch (error: any) {
        console.error("Error fetching TikTok email contact:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
