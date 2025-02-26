import axios from "axios";
import { Request, Response } from "express";

export const getLinkedInEmail = async (req: Request, res: Response) => {
  const { url } = req.body; // Get LinkedIn profile URL from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  if (!url || !apiKey) {
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
      "x-rapidapi-key": apiKey,
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
