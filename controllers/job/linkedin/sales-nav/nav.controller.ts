import axios from 'axios';
import { Request, Response } from 'express';
import { API_KEYS } from '../../../../utils/apiKeys';

export const searchCompaniesSalesNavigator = async (req: Request, res: Response) => {
    const { company } = req.body;
    

    if (!API_KEYS.LINKEDIN_API_KEY || !company) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://mtn-linkedin-scraperx-api.p.rapidapi.com/api/sales-nav/search-company-result',
        headers: {
            'x-rapidapi-key': API_KEYS.MTN_LINKEDIN_API_KEY,
            'x-rapidapi-host': 'mtn-linkedin-scraperx-api.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            company
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
    const { name, company, page } = req.body;
    

    if (!API_KEYS.LINKEDIN_API_KEY || !name || !company) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://mtn-linkedin-scraperx-api.p.rapidapi.com/api/sales-nav/search-employee-result',
        headers: {
            'x-rapidapi-key': API_KEYS.MTN_LINKEDIN_API_KEY,
            'x-rapidapi-host': 'mtn-linkedin-scraperx-api.p.rapidapi.com"',
            'Content-Type': 'application/json'
        },
        data: {
            employeeName:name,
            company:company
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

export const getCompanyDetailsSales = async(req:Request, res: Response) =>{
    const { company } = req.body;
    

    if (!API_KEYS.LINKEDIN_API_KEY|| !company) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://mtn-linkedin-scraperx-api.p.rapidapi.com/api/sales-nav/search-company-profile',
        headers: {
            'x-rapidapi-key': API_KEYS.MTN_LINKEDIN_API_KEY,
            'x-rapidapi-host': 'mtn-linkedin-scraperx-api.p.rapidapi.com"',
            'Content-Type': 'application/json'
        },
        data: {
            company:company
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
}

export const getEmployeeDetailsSales = async(req:Request, res: Response) =>{
    const { name, company } = req.body;
    

    if (!API_KEYS.LINKEDIN_API_KEY|| !company || !name) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://mtn-linkedin-scraperx-api.p.rapidapi.com/api/sales-nav/search-employee-profile',
        headers: {
            'x-rapidapi-key': API_KEYS.MTN_LINKEDIN_API_KEY,
            'x-rapidapi-host': 'mtn-linkedin-scraperx-api.p.rapidapi.com"',
            'Content-Type': 'application/json'
        },
        data: {
            company:company,
            employeeName:name
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
}