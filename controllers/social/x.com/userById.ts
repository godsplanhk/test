import axios from 'axios';
import { Request, Response } from "express";

export const x_users_by_id = async (req: Request, res: Response) => {
    const { userIds } = req.body; // Get Twitter user IDs from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!userIds) {
        res.status(400).json({ error: "Please provide an array of Twitter user IDs" });
        return;
    }

    if (!apiKey) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/get-users',
        params: { users: userIds },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data.result.data);
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter users info:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
