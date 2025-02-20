import axios from "axios";
import { Request, Response } from "express";

export const getJobDetails = async (req: Request, res: Response) => {
  const { id } = req.body; // Get job ID from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  if (!id || !apiKey) {
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
