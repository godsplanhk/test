import axios from "axios";
import { Request, Response } from "express";

export const crunchbaseOrganizationDetails = async (req: Request, res: Response) => {
  const { name:organization_identifier } = req.body; // Get organization identifier from query parameters
  const apiKey = req.headers["x-api-key"] as string; // Get API key from headers

  // Validate inputs
  if (!organization_identifier) {
    res.status(400).json({ error: "Organization identifier is required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://crunchbase-real-time-api.p.rapidapi.com/v1/organization",
    params: {
      organization_identifier,
      format: "Structured",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "crunchbase-real-time-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
