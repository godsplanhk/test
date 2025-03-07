import axios from 'axios';
import { Request, Response } from 'express';

export const searchPeopleSalesNavigator = async (req: Request, res: Response) => {
    const { url, page } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || !url) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://linkedin-sales-navigator-pay-per-lead.p.rapidapi.com/premium_search_person_via_url',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'linkedin-sales-navigator-pay-per-lead.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            page: page || 1,
            url
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};
