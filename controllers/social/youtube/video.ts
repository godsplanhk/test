import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { IgPostInput, IgPostOutput } from "../../../types/social";
import { Request, Response } from "express";

export const yt_video_scraper = async (req: Request, res: Response) => {
    try {
        const { url } = req.body as IgPostInput;
        const apiKey = req.headers["x-apify-api-key"] as string;

        if (!url) {
            res.status(400).json({ error: "URL not provided in the body" });
            return
        }

        const actorUrl = `https://api.apify.com/v2/acts/streamers~youtube-scraper/runs?token=${apiKey}`;

        // Start actor and poll in parallel
        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ startUrls:[{url}], maxResults:1 }),
        });

        console.log(response)
        let data  = await response.json();
        data = data.data
        if (!data?.id) throw new Error("Failed to start actor.");

        // Poll status while waiting for actor results
        const datasetId = await pollRunStatus(data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        // Fetch and process results
        const result = await fetchActorResults(datasetId, apiKey);

        if (!result) throw new Error("No data received from actor.");

        res.status(200).json({data:result[0]})
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err || "Actor run failed." });
    }
};
