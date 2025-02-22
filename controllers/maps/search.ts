import axios from "axios";
import { Request, Response } from "express";

export const searchPlaces = async (req: Request, res: Response) => {
  const { query, radius, location, opennow } = req.body; // Extract search parameters from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  // Validate inputs
  if (!query) {
    res.status(400).json({ error: "Search query is required" });
    return;
  }
  if (!radius) {
    res.status(400).json({ error: "Radius is required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/place/textsearch/json",
    params: {
      query,
      radius: radius || "1000",
      ...(location&&{location}), // Should be formatted as "lat,lng"
      opennow: opennow ? "true" : "false",
      language: "en",
      region: "en",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
