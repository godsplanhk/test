import axios from "axios";
import { Request, Response } from "express";

// Controller to fetch job details by job ID
export const getIndeedJobDetails = async (req: Request, res: Response) => {
    const { jobId, locality } = req.body; // Get jobId from request parameters
    const apiKey = req.headers["x-api-key"] as string; // API key from headers

    if (!jobId || !apiKey) {
        res.status(400).json({ error: "jobId and x-api-key are required" });
        return 
    }

    const options = {
        method: "GET",
        url: `https://indeed12.p.rapidapi.com/job/${jobId}`,
        params: { ...(locality && { locality }) },
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
