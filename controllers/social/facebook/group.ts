import axios from "axios";
import { Request, Response } from "express";

export const facebook_group_details = async (req: Request, res: Response) => {
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
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};
