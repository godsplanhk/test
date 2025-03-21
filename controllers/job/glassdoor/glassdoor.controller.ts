import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";

export const searchGlassdoorJobs = async (req: Request, res: Response) => {
  const {
    query,
    locationId,
    pageCursor,
    sort = "date_desc",
    seniorityLevel,
    company,
    companySize,
    easyApplyOnly,
    remoteOnly,
    jobType,
    datePosted,
    minSalary,
    maxSalary,
    city,
    companyRating,
    industry,
    jobFunction,
    limit = 10, // Default to 10 results
  } = req.body; // Get filters from request body

   // Get API key from headers

  // Validate inputs
  if (!query) {
    res.status(400).json({ error: "Job query is required" });
    return 
  }
  if (!API_KEYS.GLASSDOOR_API_KEY) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  // Build API request parameters dynamically
  const params: Record<string, any> = { query, sort };

  if (locationId) params.locationId = locationId;
  if (pageCursor) params.pageCursor = pageCursor;
  if (seniorityLevel) params.seniorityLevel = seniorityLevel;
  if (company) params.company = company;
  if (companySize) params.companySize = companySize;
  if (easyApplyOnly !== undefined) params.easyApplyOnly = easyApplyOnly;
  if (remoteOnly !== undefined) params.remoteOnly = remoteOnly;
  if (jobType) params.jobType = jobType;
  if (datePosted) params.datePosted = datePosted;
  if (minSalary) params.minSalary = minSalary;
  if (maxSalary) params.maxSalary = maxSalary;
  if (city) params.city = city;
  if (companyRating) params.companyRating = companyRating;
  if (industry) params.industry = industry;
  if (jobFunction) params.jobFunction = jobFunction;

  const options = {
    method: "GET",
    url: "https://glassdoor-real-time.p.rapidapi.com/jobs/search",
    params,
    headers: {
      "x-rapidapi-key": API_KEYS.GLASSDOOR_API_KEY,
      "x-rapidapi-host": "glassdoor-real-time.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const jobListings = response.data?.data?.jobListings || [];

    // Format response to return essential fields
    const formattedData = jobListings.slice(0, limit).map((l: any) => {
      const job = l.jobview.job;
      return {
        listingId: job.listingId,
        queryString:job.queryString
      };
    });

    res.status(200).json({ data: formattedData });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

export const glassdoorLocationId = async (req: Request, res: Response) => {
    const { query } = req.body; // Get location from request body
     // Get API key from headers
  
    // Validate inputs
    if (!query) {
      res.status(400).json({ error: "Location query is required" });
      return;
    }
    if (!API_KEYS.GLASSDOOR_API_KEY) {
      res.status(400).json({ error: "API key is required" });
      return;
    }
  
    const options = {
      method: "GET",
      url: "https://glassdoor-real-time.p.rapidapi.com/jobs/location",
      params: { query },
      headers: {
        "x-rapidapi-key": API_KEYS.GLASSDOOR_API_KEY,
        "x-rapidapi-host": "glassdoor-real-time.p.rapidapi.com",
      },
    };
  
    try {
      const response = await axios.request(options);
      res.status(200).json({id:response.data.data[0].locationId});
    } catch (error: any) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  };

  export const getGlassdoorJobDetails = async (req: Request, res: Response) => {
    const { listingId, queryString } = req.body; // Get listingId and queryString from request body
     // Get API key from headers
  
    // Validate inputs
    if (!listingId || !queryString) {
      res.status(400).json({ error: "Both listingId and queryString are required" });
      return;
    }
    if (!API_KEYS.GLASSDOOR_API_KEY) {
      res.status(400).json({ error: "API key is required" });
      return;
    }
  
    const options = {
      method: "GET",
      url: "https://glassdoor-real-time.p.rapidapi.com/jobs/details",
      params: { listingId, queryString },
      headers: {
        "x-rapidapi-key": API_KEYS.GLASSDOOR_API_KEY,
        "x-rapidapi-host": "glassdoor-real-time.p.rapidapi.com",
      },
    };
  
    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  };
  