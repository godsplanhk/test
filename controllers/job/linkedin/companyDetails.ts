import axios from "axios";
import { Request, Response } from "express";

export const getCompanyDetails = async (req: Request, res: Response) => {
  const { name } = req.body; // Get company name from query parameters
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  // Validate inputs
  if (!name) {
    res.status(400).json({ error: "Company name is required" });
    return 
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/get-company-details",
    params: { username: name as string },
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
