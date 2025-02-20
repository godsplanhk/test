import { ApifyClient } from "apify-client";
import { Request, Response } from "express";

export const linkedinSalesNavigator = async (req: Request, res: Response) => {
  const { cookie, searchUrl, limit } = req.body; // Extract input parameters
  const apiToken = req.headers["x-api-key"] as string; // Get Apify API token from headers

  // Validate required inputs
  if (!cookie || !searchUrl) {
    res.status(400).json({ error: "All fields (cookies, searchUrl) are required" });
    return 
  }
  if (!apiToken) {
    res.status(400).json({ error: "API key is required" });
    return
  }

  try {
    // Initialize ApifyClient with API token
    const client = new ApifyClient({ token: apiToken });

    // Prepare input for the Apify Actor
    const input = { cookie:JSON.parse(cookie), searchUrl, deepScrape:true, count: limit,
        proxy:{
            "useApifyProxy": true,
            "apifyProxyCountry": "US",
            "apifyProxyGroups": [
            "RESIDENTIAL"
            ]
        }
     };

    // Run the Actor
    const run = await client.actor("curious_coder/linkedin-sales-navigator-search-scraper").call(input);

    // Fetch results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    res.status(200).json({
      data: items,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
