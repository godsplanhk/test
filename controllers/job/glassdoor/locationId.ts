import axios from "axios";
import { Request, Response } from "express";

export const glassdoorLocationId = async (req: Request, res: Response) => {
  const { query } = req.body; // Get location from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from headers

  // Validate inputs
  if (!query) {
    res.status(400).json({ error: "Location query is required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://glassdoor-real-time.p.rapidapi.com/jobs/location",
    params: { query },
    headers: {
      "x-rapidapi-key": apiKey,
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
