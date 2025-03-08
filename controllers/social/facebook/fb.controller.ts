import axios from "axios";
import { Request, Response } from "express";

export const facebook_group_scraper = async (req: Request, res: Response) => {
    const groupUrl = req.body.url;
    const apiKey = req.headers["x-api-key"] as string;
    
    if (!groupUrl || !apiKey) {
        res.status(400).json({ error: 'url and x-api-key header are required' });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/group/details',
        params: { url: groupUrl },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.group_details});
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

export const facebook_page_scraper = async (req: Request, res: Response) => {
    const { url } = req.body; // Get Facebook page URL from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!url) {
        res.status(400).json({ error: "Please provide a Facebook page URL" });
        return;
    }

    if (!apiKey) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/page/details',
        params: { url },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.results});
        return;
    } catch (error: any) {
        console.error("Error fetching Facebook page details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};

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
        res.status(200).json({data:response.data.results});
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};