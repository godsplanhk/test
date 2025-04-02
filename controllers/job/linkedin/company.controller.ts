import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";

export const getCompanyDetails = async (req: Request, res: Response) => {
  const { name } = req.body; // Get company name from query parameters
 // Get API key from request headers

  // Validate inputs
  if (!name) {
    res.status(400).json({ error: "Company name is required" });
    return 
  }


  const options = {
    method: "GET",
    url: "https://mtn-linkedin-scraperx-api.p.rapidapi.com/api/sales-nav/search-company-profile",
    params: { company: name as string },
    headers: {
      "x-rapidapi-key": API_KEYS.MTN_LINKEDIN_API_KEY,
      "x-rapidapi-host": "mtn-linkedin-scraperx-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};


export const getCompanyByDomain = async (req: Request, res: Response) => {
  const { domain } = req.body; // Extract domain from query parameters
 // Extract API key from headers

  // Validate inputs
  if (!domain) {
    res.status(400).json({ error: "Company domain is required" });
    return 
  }


  const options = {
    method: "GET",
    url: "https://linkedin-data-api.p.rapidapi.com/get-company-by-domain",
    params: { domain },
    headers: {
      "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
      "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.message });
  }
};

export const getHiringTeam = async (req: Request, res: Response) => {
    const { id } = req.body; // Get job ID and job URL from request body
   // Get API key from request headers
  
    if (!id || !API_KEYS.LINKEDIN_API_KEY) {
        res
          .status(400)
          .json({ error: "Job ID and API key are required" });
      return 
    }
  
    const options = {
      method: "GET",
      url: "https://linkedin-api8.p.rapidapi.com/get-hiring-team",
      params: { id, url:`https://www.linkedin.com/jobs/view/${id}/` },
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
  