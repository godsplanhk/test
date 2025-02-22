import axios from "axios";
import { Request, Response } from "express";

export const getPlaceDetailedInformation = async (req: Request, res: Response) => {
  const { place_id } = req.body; // Extract place ID from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  // Validate inputs
  if (!place_id) {
    res.status(400).json({ error: "Place ID is required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/place/details/json",
    params: {
      place_id,
      region: "en",
      fields: "all",
      language: "en",
      reviews_no_translations: "true",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data.result);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
