import axios from "axios";
import { Request, Response } from "express";

export const searchLinkedInLocations = async (req: Request, res: Response) => {
  const { keyword } = req.body; // Get keyword from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  if (!keyword || !apiKey) {
    res.status(400).json({ error: "Keyword and API key are required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/search-locations",
    params: { keyword },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    let loc = response.data.data.items[0]
    loc = loc.id.replace("urn:li:geo:","")
    res.status(200).json({loc});
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
