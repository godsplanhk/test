import axios from 'axios';
import { Request, Response } from 'express';

export const search_linkedin_jobs = async (req: Request, res: Response) => {
    const { keywords, locationId, companyIds, jobType, salary, experienceLevel, onsiteRemote, datePosted, sort } = req.body;
    const apiKey = req.headers["x-api-key"] as string;

    if (!keywords || !apiKey) {
        res.status(400).json({ error: 'keywords, locationId, and x-api-key are required' });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://linkedin-api8.p.rapidapi.com/search-jobs',
        params: {
            keywords,
            locationId,
            datePosted: datePosted || 'anyTime',
            sort: sort || 'mostRelevant',
            ...(companyIds && {companyIds}),
            ...(jobType && {jobType}),
            ...(experienceLevel && {experienceLevel}),
            ...(onsiteRemote && {onsiteRemote}),
            ...(salary && {salary}),
            ...(sort && {sort}),

        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

// export type LinkedInJobSearchParams = {
//     keywords: string;
//     locationId?: number;
//     companyIds?: string;
//     datePosted?: "anyTime" | "pastMonth" | "pastWeek" | "past24Hours";
//     salary?: "40k+" | "60k+" | "80k+" | "100k+" | "120k+" | "140k+" | "160k+" | "180k+" | "200k+";
//     jobType?: "fullTime" | "partTime" | "contract" | "internship";
//     experienceLevel?: "internship" | "associate" | "director" | "entryLevel" | "midSeniorLevel" | "executive";
//     onsiteRemote?: "onSite" | "remote" | "hybrid";
//     sort?: "mostRelevant" | "mostRecent"
// };
  