import axios from "axios";
import { Request, Response } from "express";

export const getGlassdoorJobDetails = async (req: Request, res: Response) => {
  const { listingId, queryString } = req.body; // Get listingId and queryString from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from headers

  // Validate inputs
  if (!listingId || !queryString) {
    res.status(400).json({ error: "Both listingId and queryString are required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://glassdoor-real-time.p.rapidapi.com/jobs/details",
    params: { listingId, queryString },
    headers: {
      "x-rapidapi-key": apiKey,
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
