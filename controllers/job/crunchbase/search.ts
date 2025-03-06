import axios from "axios";
import { Request, Response } from "express";

export const crunchbaseOrganizationDetails = async (req: Request, res: Response) => {
  const { data, fullName, firstName, lastName, companyPremium, companyFull, companyFrench, personFull, debug } = req.body;
  const apiKey = req.headers["x-api-key"] as string;

  // Validate inputs
  if (!data) {
    res.status(400).json({ error: "Data parameter is required" });
    return 
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const params: Record<string, string> = { data };
  if (fullName) params.fullName = fullName;
  if (firstName) params.firstName = firstName;
  if (lastName) params.lastName = lastName;
  if (companyPremium) params.companyPremium = companyPremium;
  if (companyFull) params.companyFull = companyFull;
  if (companyFrench) params.companyFrench = companyFrench;
  if (personFull) params.personFull = personFull;
  if (debug) params.debug = debug;

  const options = {
    method: "GET",
    url: "https://enrichment-b2b-linkedin-crunchbase-datagma.p.rapidapi.com/api/ingress/v2/full",
    params,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "enrichment-b2b-linkedin-crunchbase-datagma.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.log(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};