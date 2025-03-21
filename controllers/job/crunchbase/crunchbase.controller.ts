import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";

export const crunchbaseOrganizationDetails = async (req: Request, res: Response) => {
  const { url } = req.body;

  // Validate inputs
  if (!url) {
    res.status(400).json({ error: "Data parameter is required" });
    return 
  }
  if (!API_KEYS.APPOLLO_API_KEY) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const options = {
    method: 'POST',
    url: 'https://crunchbase4.p.rapidapi.com/company',
    headers: {
      'x-rapidapi-key': '7a69cba1c1mshe48488e72b07ce7p1dae62jsn76c5b1bbabad',
      'x-rapidapi-host': 'crunchbase4.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      company_domain: url
    }
  };
  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.log(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};