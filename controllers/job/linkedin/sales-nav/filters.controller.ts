import axios from 'axios';
import { Request, Response } from 'express';

export const getIndustrySuggestions = async (req: Request, res: Response) => {
    const { query, page } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || !query) {
        res.status(400).json({ error: "API key and query are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://linkedin-sales-navigator-pay-per-lead.p.rapidapi.com/filter_industry_suggestions',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'linkedin-sales-navigator-pay-per-lead.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            page: page || 1,
            query,
        }
    };

    try {
        const response = await axios.request(options);
        res.json({value:response.data.data[0].displayValue, id: response.data.data[0].id});
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};
