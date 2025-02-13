import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { IgPostInput, IgPostOutput } from "../../../types/social";
import { Request, Response } from "express";

export const ig_hashtag_scraper = async (req: Request, res: Response) => {
    try {
        const { hashtags, type, limit } = req.body;
        const apiKey = req.headers["x-apify-api-key"] as string;

        if (!hashtags) {
            res.status(400).json({ error: "URL not provided in the body" });
            return
    }

        const actorUrl = `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/runs?token=${apiKey}`;

        // Start actor and poll in parallel
        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({hashtags:JSON.parse(hashtags), resultsLimit:limit||1,resultsType:type||"posts"}),
        });

        let data  = await response.json();
        console.log(data)
        data = data.data
        if (!data?.id) throw new Error("Failed to start actor.");

        // Poll status while waiting for actor results
        const datasetId = await pollRunStatus(data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        // Fetch and process results
        const result:any = await fetchActorResults(datasetId, apiKey);

        if (!result) throw new Error("No data received from actor.");
        res.status(200).json({
            data: result[0] || []
               
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err || "Actor run failed." });
    }
};
