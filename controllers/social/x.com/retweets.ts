import axios from 'axios';
import { Request, Response } from "express";


export const x_retweets = async (req: Request, res: Response) => {
    const { postId, limit } = req.body; // Get Twitter post ID from request body
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
        url: 'https://twitter241.p.rapidapi.com/retweets',
        params: {
          pid: postId,
          count: limit || '5'
        },
        headers: {
          'x-rapidapi-key': '53adfd298emsh111caccbdb92fc9p181a7cjsn99b33edc1aa7',
          'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
      };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter tweet details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
