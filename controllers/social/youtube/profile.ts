import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { IgPostInput, IgPostOutput } from "../../../types/social";
import { Request, Response } from "express";

export const yt_profile_scraper = async (req: Request, res: Response) => {
    try {
        const { url:_url } = req.body;
        const apiKey = req.headers["x-apify-api-key"] as string;

        if (!_url) {
            res.status(400).json({ error: "URL not provided in the body" });
            return
        }

            const actorUrl = `https://api.apify.com/v2/acts/streamers~youtube-scraper/runs?token=${apiKey}`;

            // Start actor and poll in parallel
            const response = await fetch(actorUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startUrls: [{url: _url +"/about"}]}),
            });
            let data  = await response.json();
            console.log(data)
            data = data.data
            if (!data?.id) throw new Error("Failed to start actor.");

            // Poll status while waiting for actor results
            const datasetId = await pollRunStatus(data.id, apiKey);
            if (!datasetId) throw new Error("Failed to get dataset ID.");

            // Fetch and process results
            const profileResults = await fetchActorResults(datasetId, apiKey);

        res.status(200).json({data:profileResults[0]})
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err || "Actor run failed." });
    }
};
