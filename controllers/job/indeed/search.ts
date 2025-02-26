import axios from "axios";
import { Request, Response } from "express";

// Controller to fetch job listings from Indeed API
export const searchIndeedJobs = async (req: Request, res: Response) => {
    const {
        query,
        location,
        page_id,
        locality,
        fromage,
        radius,
        sort,
        job_type
    } = req.body; // Extracting parameters from the request body

    const apiKey = req.headers["x-api-key"] as string;

    if (!query || !apiKey) {
        res.status(400).json({ error: "query and x-api-key are required" });
        return 
    }

    const options = {
        method: "GET",
        url: "https://indeed12.p.rapidapi.com/jobs/search",
        params: {
            query,
            ...(location && { location }),
            ...(page_id && { page_id }),
            ...(locality && { locality }),
            ...(fromage && { fromage }),
            ...(radius && { radius }),
            ...(sort && { sort }),
            ...(job_type && { job_type })
        },
        headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "indeed12.p.rapidapi.com"
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};
