import axios from "axios";
import { Request, Response } from "express";

export const getPlaceDetails = async (req: Request, res: Response) => {
  const { place } = req.body; // Get place name from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  // Validate inputs
  if (!place) {
    res.status(400).json({ error: "Place name is required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/place/findplacefromtext/json",
    params: {
      input: place,
      inputtype: "textquery",
      fields: "all",
      language: "en",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data.candidates);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
