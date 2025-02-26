import { Request, Response } from 'express';
import axios from 'axios';

export const searchApolloPeople = async (req: Request, res: Response) => {
    try {
        // Extract organization name and page from request body
        const { organization, page } = req.body;
        const apiKey = req.headers['x-api-key']; // Use API key from headers

        // Validate inputs
        if (!organization) {
            res.status(400).json({ error: "Missing required field: organization" });
            return;
        }
        if (!apiKey) {
            res.status(500).json({ error: "API key is not configured" });
            return;
        }

        // API request options
        const options = {
            method: "GET",
            url: "https://apollo-io-no-cookies-required.p.rapidapi.com/search_people",
            headers: {
                "x-rapidapi-key": apiKey as string,
                "x-rapidapi-host": "apollo-io-no-cookies-required.p.rapidapi.com",
                "Content-Type": "application/json"
            },
            params: { q_organization_name: organization, page: page || 1 }
        };

        // Make API request
        const response = await axios.request(options);

        // Return response data
        res.status(200).json(response.data.data);
        return;

    } catch (error: any) {
        console.error("🚨 Error fetching Apollo.io data:", error);
        res.status(error.response?.status || 500).json({ error: error.message });
        return;
    }
};
