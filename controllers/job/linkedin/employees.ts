import axios from "axios";
import { Request, Response } from "express";

export const searchEmployees = async (req: Request, res: Response) => {
  const { companyId, geoIds, currentTitles } = req.body; // Get query parameters from request

  // Validate required query parameters
  if (!companyId) {
    res.status(400).json({ error: "Company ID and API Key are required" });
    return 
  }

  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/search-employees",
    params: {
      companyId: companyId as string,
      ...(geoIds && {geoIds}),
      ...(currentTitles && {currentTitles})
    },
    headers: {
      "x-rapidapi-key": apiKey,
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
