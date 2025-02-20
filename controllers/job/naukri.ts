import { ApifyClient } from "apify-client";
import { Request, Response } from "express";
import { parseNaukriJobDetails } from "../../utils/helpers";

export const scrapeNaukriJobs = async (req: Request, res: Response) => {
  const  apiToken  = req.headers["x-api-key"]; // Get Apify API token from headers
  const {keyword, maxJobs, freshness, sortBy, experience, location} = req.body
  // Validate API token
  if (!apiToken || !keyword || !maxJobs) {
    res.status(400).json({ error: "Apify API token, Keyword and Max Jobs are required" });
    return;
  }

  try {
    // Initialize ApifyClient with API token
    const client = new ApifyClient({ token: apiToken as string });

    // Prepare Actor input (modify as needed)
    const input = {
        keyword,
        maxJobs,
        ...(freshness && {freshness}),
        ...(sortBy && {sortBy}),
        ...(experience && {experience}),
        ...(location && {location}),
    };

    // Run the Actor and wait for it to finish
    const run = await client.actor("muhammetakkurtt/naukri-job-scraper").call(input);

    // Fetch and return Actor results from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    const formattedOutput = items.map(i=>{
        return {...i, jobDescription:parseNaukriJobDetails(i.jobDescription as string)}
    })
    res.status(200).json({
      data: formattedOutput,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

