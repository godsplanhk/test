import axios from 'axios';
import { Request, Response } from "express";


export const x_comments_api = async (req: Request, res: Response) => {
    const { postId, count } = req.body; // Get Twitter post ID and count from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!postId) {
        res.status(400).json({ error: "Please provide a Twitter post ID" });
        return;
    }

    if (!apiKey) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/comments',
        params: {
            pid: postId,
            count: count || '2',
            rankingMode: 'Relevance'
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter post comments:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
