import axios from "axios";
import { Request, Response } from "express";

export const facebook_page_details = async (req: Request, res: Response) => {
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
        res.status(200).json(response.data);
        return;
    } catch (error: any) {
        console.error("Error fetching Facebook page details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
