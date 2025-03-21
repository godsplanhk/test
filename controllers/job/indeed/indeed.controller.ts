import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";

// Controller to fetch job details by job ID
export const getIndeedJobDetails = async (req: Request, res: Response) => {
    const { jobId, locality } = req.body; // Get jobId from request parameters
 // API key from headers

    if (!jobId || !API_KEYS.INDEED_API_KEY) {
        res.status(400).json({ error: "jobId and x-api-key are required" });
        return 
    }

    const options = {
        method: "GET",
        url: `https://indeed12.p.rapidapi.com/job/${jobId}`,
        params: { ...(locality && { locality }) },
        headers: {
            "x-rapidapi-key": API_KEYS.INDEED_API_KEY,
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



    if (!query || !API_KEYS.INDEED_API_KEY) {
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
            "x-rapidapi-key": API_KEYS.INDEED_API_KEY,
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
