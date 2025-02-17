import axios from "axios";
import { Request, Response } from "express";

export const facebook_search = async (req: Request, res: Response) => {
    const query = req.body.query;
    const apiKey = req.headers["x-api-key"] as string;
    
    if (!query || !apiKey) {
        res.status(400).json({ error: 'query and x-api-key header are required' });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/search/posts',
        params: { query },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};