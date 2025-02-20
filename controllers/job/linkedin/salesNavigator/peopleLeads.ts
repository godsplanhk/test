import express, { Request, Response } from 'express';
import axios from 'axios';

export const salesNavigatorPeople = async (req:Request, res:Response) => {
    try {
        // Extract parameters from request body
        const { url, account_number, page } = req.body;
        const apiKey = req.headers['x-api-key']; // Use environment variable for security

        // Validate input
        if (!url) {
            res.status(400).json({ error: "Missing required fields: url, page, account_number" });
            return 
        }
        if (!apiKey) {
            res.status(500).json({ error: "API key is not configured" });
            return 
        }

        // API request options
        const options = {
            method: "POST",
            url: "https://linkedin-sales-navigator-no-cookies-required.p.rapidapi.com/premium_search_person_via_url",
            headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": "linkedin-sales-navigator-no-cookies-required.p.rapidapi.com",
                "Content-Type": "application/json"
            },
            data: { page: page || 1, url, account_number: account_number || 1 }
        };

        // Make API request
        const response = await axios.request(options);

        // Return response data
        res.status(200).json(response.data.response);
        return 

    } catch (error:any) {
        console.error("🚨 Error fetching LinkedIn search data:", error);
        res.status(error.response?.status || 500).json({ error: error.message });
        return 
    }
};

