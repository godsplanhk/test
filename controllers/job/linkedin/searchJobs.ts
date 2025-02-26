import axios from 'axios';
import { Request, Response } from 'express';

/**
 * @description Search LinkedIn jobs using RapidAPI
 * @route GET /search_linkedin_jobs
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const search_linkedin_jobs = async (req: Request, res: Response) => {
    const {
        keywords,
        locationId,
        companyIds,
        datePosted = "anyTime",
        salary,
        jobType,
        experienceLevel,
        titleIds,
        functionIds,
        start,
        industryIds,
        onsiteRemote,
        sort = "mostRelevant",
        distance
    } = req.body;

    const apiKey = req.headers["x-api-key"] as string;

    // Validate required fields
    if (!keywords || !apiKey) {
        res.status(400).json({ error: "keywords and x-api-key are required" });
        return;
    }

    // API Request Options
    const options = {
        method: "GET",
        url: "https://linkedin-api8.p.rapidapi.com/search-jobs-v2",
        params: {
            keywords,
            ...(locationId && { locationId }),
            ...(companyIds && { companyIds }),
            datePosted,
            ...(salary && { salary }),
            ...(jobType && { jobType }),
            ...(experienceLevel && { experienceLevel }),
            ...(titleIds && { titleIds }),
            ...(functionIds && { functionIds }),
            ...(start && { start }),
            ...(industryIds && { industryIds }),
            ...(onsiteRemote && { onsiteRemote }),
            sort,
            ...(distance && { distance }),
        },
        headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

export type LinkedInJobSearchParams = {
    keywords: string;
    locationId?: number;
    companyIds?: string;
    datePosted?: "anyTime" | "pastMonth" | "pastWeek" | "past24Hours";
    salary?: "40k+" | "60k+" | "80k+" | "100k+" | "120k+" | "140k+" | "160k+" | "180k+" | "200k+";
    jobType?: "fullTime" | "partTime" | "contract" | "internship";
    experienceLevel?: "internship" | "associate" | "director" | "entryLevel" | "midSeniorLevel" | "executive";
    titleIds?: string;
    functionIds?: string;
    start?: number; // 0, 50, 100, 150, ..., max 975
    industryIds?: string;
    onsiteRemote?: "onSite" | "remote" | "hybrid";
    sort?: "mostRelevant" | "mostRecent";
    distance?: "0" | "5" | "10" | "25" | "50" | "100"; // Distance in km mapped as: 0=0km, 5=8km, 10=16km, etc.
};
