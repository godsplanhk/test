import axios from 'axios';
import { Request, Response } from 'express';
import { API_KEYS } from '../../../../utils/apiKeys';

export const searchCompaniesSalesNavigator = async (req: Request, res: Response) => {
    const { url, page } = req.body;
    

    if (!API_KEYS.LINKEDIN_API_KEY || !url) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://linkedin-sales-navigator-pay-per-lead.p.rapidapi.com/premium_search_company_via_url',
        headers: {
            'x-rapidapi-key': API_KEYS.LINKEDIN_API_KEY,
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

export const searchPeopleSalesNavigator = async (req: Request, res: Response) => {
    const { url, page } = req.body;
    

    if (!API_KEYS.LINKEDIN_API_KEY || !url) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://linkedin-sales-navigator-pay-per-lead.p.rapidapi.com/premium_search_person_via_url',
        headers: {
            'x-rapidapi-key': API_KEYS.LINKEDIN_API_KEY,
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
