import axios from "axios";
import { Request, Response } from "express";

export const getCompanyByDomain = async (req: Request, res: Response) => {
  const { domain } = req.body; // Extract domain from query parameters
  const apiKey = req.headers["x-api-key"] as string; // Extract API key from headers

  // Validate inputs
  if (!domain) {
    res.status(400).json({ error: "Company domain is required" });
    return 
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-data-api.p.rapidapi.com/get-company-by-domain",
    params: { domain },
    headers: {
      "x-rapidapi-key": apiKey,
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
