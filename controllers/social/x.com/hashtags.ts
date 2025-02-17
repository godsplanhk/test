import axios from 'axios';
import { Request, Response } from "express";

export const x_hashtags = async (req: Request, res: Response) => {
    const { query, count } = req.body;
    const apiKey = req.headers["x-api-key"] as string;

    if (!query) {
        res.status(400).json({ error: "Please provide a search query" });
        return;
    }

    if (!apiKey) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/search-community',
        params: {
            query,
            count: count || '20'
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data.result.communities_search_slice);
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter community search results:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
