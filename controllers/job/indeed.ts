import { ApifyClient } from "apify-client";
import { Request, Response } from "express";
import { parseJobDescription } from "../../utils/helpers";

export const scrapeIndeedJobs = async (req: Request, res: Response) => {
  const { position, country, location, maxItems } = req.body; // Extract input parameters
  const apiToken = req.headers["x-api-key"] as string; // Get Apify API token from headers

  // Validate required inputs
  if (!position || !country || !location) {
    res.status(400).json({ error: "All fields (position, country, location, maxItems) are required" });
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
    const input = { position, country, location, maxItems: maxItems || 5, parseCompanyDetails:true };

    // Run the Actor
    const run = await client.actor("misceres/indeed-scraper").call(input);

    // Fetch results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    const formattedOutput = items.map(i=>{
        return {
            ...i,
            description: parseJobDescription(i.descriptionHTML as string || "")
        }
    })

    res.status(200).json({
      jobs: formattedOutput,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
