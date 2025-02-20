import axios from "axios";
import { Request, Response } from "express";

export const getPostedJobs = async (req: Request, res: Response) => {
  const { username } = req.body; // Get LinkedIn username from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  if (!username || !apiKey) {
    res.status(400).json({ error: "Username and API key are required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/profiles/posted-jobs",
    params: { username },
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
