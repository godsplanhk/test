import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { IgPostInput, IgPostOutput } from "../../../types/social";
import { Request, Response } from "express";

export const ig_reel_scraper = async (req: Request, res: Response) => {
    try {
        const { url } = req.body as IgPostInput;
        const apiKey = req.headers["x-apify-api-key"] as string;

        if (!url) {
            res.status(400).json({ error: "URL not provided in the body" });
            return 
        }
        if (!apiKey) {
            res.status(400).json({ error: "Missing API Key in headers" });
            return 
        }

        const actorUrl = `https://api.apify.com/v2/acts/pratikdani~instagram-reels-scraper/runs?token=${apiKey}`;

        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();
        if (!data?.data?.id) throw new Error("Failed to start reels scraper actor.");

        const datasetId = await pollRunStatus(data.data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        const result = await fetchActorResults(datasetId, apiKey);
        if (!result || result.length === 0) throw new Error("No data found for the given reel.");

        const output_data: IgPostOutput = {
            number_of_comments: result[0]?.num_comments || 0,
            number_of_likes: result[0]?.likes || 0,
            username: result[0]?.user_posted || "Unknown",
            post_date: result[0]?.date_posted || "Unknown",
            location: result[0]?.location || "Unknown",
            video: result[0]?.video_url || "",
            engagement_rate: "", // Consider adding engagement rate calculation
            number_of_played: result[0]?.video_play_count || 0,
        };

        res.status(200).json({ data: output_data });
    } catch (error) {
        console.error("Error in ig_reel_scraper:", error);
        res.status(500).json({ error: "Actor run failed." });
    }
};
