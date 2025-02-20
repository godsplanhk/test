import express, { Request, Response } from 'express';
import axios from 'axios';

export const searchApolloComapnies = async (req:Request, res:Response) => {
    try {
        // Extract parameters from request body
        const { url, page } = req.body;
        const apiKey = req.headers['x-api-key']; // Use environment variable for security

        // Validate input
        if (!url) {
            res.status(400).json({ error: "Missing required fields: url" });
            return 
        }
        if (!apiKey) {
            res.status(500).json({ error: "API key is not configured" });
            return 
        }

        // API request options
        const options = {
            method: "POST",
            url: "https://apollo-io-no-cookies-required.p.rapidapi.com/search_organizations_via_url",
            headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": "apollo-io-no-cookies-required.p.rapidapi.com",
                "Content-Type": "application/json"
            },
            data: { url, page: page || 1 }
        };

        // Make API request
        const response = await axios.request(options);

        // Return response data
        res.status(200).json(response.data);
        return 

    } catch (error:any) {
        console.error("🚨 Error fetching Apollo.io data:", error);
        res.status(error.response?.status || 500).json({ error: error.message });
        return 
    }
};

