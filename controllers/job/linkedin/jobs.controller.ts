import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";
import { searchLinkedInLocations } from "../../../utils/helpers";

export const jobs_posted_by_profile = async (req: Request, res: Response) => {
  const { username } = req.body; // Get LinkedIn username from request body
   // Get API key from request headers

  if (!username) {
    res.status(400).json({ error: "Username and API key are required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/profiles/posted-jobs",
    params: { username },
    headers: {
      "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
      "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

/**
 * @description Search LinkedIn jobs using RapidAPI
 * @route GET /search_linkedin_jobs
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const search_linkedin_jobs = async (req: Request, res: Response) => {
    const {
        keywords,
        locationName,
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

    
    const locationId = await searchLinkedInLocations(locationName)
    // Validate required fields
    if (!keywords) {
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
            "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
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


export const linkedin_job_details = async (req: Request, res: Response) => {
    const { id } = req.body; // Get job ID from request body
     // Get API key from request headers
  
    if (!id) {
        res
          .status(400)
          .json({ error: "Job ID and API key are required" });
      return 
    }
  
    const options = {
      method: "GET",
      url: "https://linkedin-api8.p.rapidapi.com/get-job-details",
      params: { id },
      headers: {
        "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
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
  