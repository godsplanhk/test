import axios from 'axios';
import { Request, Response } from "express";

export const x_profile_info = async (req: Request, res: Response) => {
    const { username } = req.body; // Get Twitter username from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!username) {
        res.status(400).json({ error: "Please provide a Twitter username" });
        return;
    }

    if (!apiKey) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/user',
        params: { username },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data.result.data.user.result);
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter user info:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
