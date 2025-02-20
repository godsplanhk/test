import axios from "axios";
import { Request, Response } from "express";

export const getDirections = async (req: Request, res: Response) => {
  const { origin, destination, departure_time, mode, traffic_model } = req.body; // Extract parameters from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from request headers

  // Validate inputs
  if (!origin || !destination) {
    res.status(400).json({ error: "Both origin and destination are required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/directions/json",
    params: {
      origin,
      destination,
      departure_time: departure_time || "now",
      traffic_model: traffic_model || "best_guess",
      region: "en",
      transit_routing_preference: "less_walking",
      alternatives: "true",
      units: "metric",
      transit_mode: "train|tram|subway",
      mode: mode || "driving",
      language: "en",
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
