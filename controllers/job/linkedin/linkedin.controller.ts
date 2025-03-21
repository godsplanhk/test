import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";

export const getLinkedInProfile = async (req: Request, res: Response) => {
  const { url } = req.body; // Get keyword from request body

  if (!url) {
    res.status(400).json({ error: "Keyword and API key are required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url",
    params: { url },
    headers: {
      "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
      "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json({data:response.data});
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

  
  export const getLinkedInEmail = async (req: Request, res: Response) => {
    const { url } = req.body; // Get LinkedIn profile URL from request body
    // Get API key from request headers
  
    if (!url) {
        res
          .status(400)
          .json({ error: "LinkedIn profile URL and API key are required" });
      return 
    }
  
    const options = {
      method: "GET",
      url: "https://linkedin-api8.p.rapidapi.com/linkedin-to-email",
      params: { url },
      headers: {
        "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
        "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
      },
    };
  
    try {
      const response = await axios.request(options);
      res.status(200).json({email:response.data});
    } catch (error: any) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  };
  