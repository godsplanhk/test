import axios from 'axios';
import { Request, Response } from "express";
import { API_KEYS } from '../../../utils/apiKeys';

export const yt_search_scraper = async (req: Request, res: Response) => {
    const { query, limit } = req.body; // Get search query from request
     // API key from request headers

    if (!query) {
        res.status(400).json({ error: "Please provide a search query" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/search/',
        params: {
            q: query,
            hl: 'en',
            gl: 'US'
        },
        headers: {
            'x-rapidapi-key': API_KEYS.YOUTUBE_API_KEY,
            'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.contents.slice(0, limit || 2)});
        return 
    } catch (error: any) {
        console.error("Error fetching YouTube search results:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};
