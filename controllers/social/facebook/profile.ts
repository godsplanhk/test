import axios from "axios";
import { Request, Response } from "express";

export const facebook_profile_scraper = async (req: Request, res: Response) => {
    const {profile} = req.body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!apiKey || !profile) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/profile/details_url',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        },
        params:{
            url:profile
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.profile});
        return;
    } catch (error: any) {
        console.error("Error fetching Facebook profile details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};