import axios from "axios";
import { Request, Response } from "express";

export const searchGlassdoorJobs = async (req: Request, res: Response) => {
  const { query, locationId, seniorityLevel, minSalary, maxSalary, limit } = req.body; // Get job query from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from headers

  // Validate inputs
  if (!query) {
    res.status(400).json({ error: "Job query is required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const options = {
    method: "GET",
    url: "https://glassdoor-real-time.p.rapidapi.com/jobs/search",
    params: { query, 
        ...(locationId && {locationId}), 
        sort:"date_desc", 
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "glassdoor-real-time.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const formattedData = response.data.data.jobListings.map((l:any)=>{
        const job = l.jobview.job
        return {listingId:job.listingId, queryString:job.queryString}
    })
    res.status(200).json({data:formattedData.slice(0,limit)});
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
