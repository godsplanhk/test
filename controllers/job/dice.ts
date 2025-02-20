import { ApifyClient } from "apify-client";
import { Request, Response } from "express";

export const searchDiceJobs = async (req: Request, res: Response) => {
  const { query, country, radius, maxResults } = req.body; // Extract input parameters
  const apiToken = req.headers["x-api-key"] as string; // Get Apify API token from headers

  if (!query || !country || !radius) {
    res.status(400).json({ error: "All fields (query, country, radius, maxItems) are required" });
    return 
  }
  if (!apiToken) {
    res.status(400).json({ error: "API key is required" });
    return
  }

  try {
    const client = new ApifyClient({ token: apiToken });

    const searchUrl = `https://www.dice.com/jobs?q=${query}&countryCode=${country}&radius=${radius}&radiusUnit=mi&page=1&pageSize=20&language=en`
    const input = { searchUrl, maxResults:maxResults||10 };
    // Run the Actor
    const run = await client.actor("easyapi/dice-com-job-scraper").call(input);

    // Fetch results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    res.status(200).json({
      jobs: items,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
