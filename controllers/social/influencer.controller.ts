import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../utils/apiKeys";

export const searchInfluencers = async (req: Request, res: Response) => {
  const { keyword } = req.body; // Get search keyword from request body
   // Get API key from request headers

  // Validate inputs
  if (!keyword) {
    res.status(400).json({ error: "Keyword is required" });
    return;
  }

  if (!API_KEYS.INFLUENCER_API_KEY) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://social-media-influencer-api.p.rapidapi.com/search",
    params: { keyword },
    headers: {
      "x-rapidapi-key": API_KEYS.INFLUENCER_API_KEY,
      "x-rapidapi-host": "social-media-influencer-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data); // Return the influencer search results
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
