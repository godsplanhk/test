import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { IgPostInput, IgPostOutput } from "../../../types/social";
import { Request, Response } from "express";

export const ig_post_scraper = async (req: Request, res: Response) => {
    const { url } = req.body as IgPostInput;
    const apiKey = req.headers["x-apify-api-key"] as string;

    if (!url) {
        res.status(400).json({ error: "URL not provided in the body" });
        return
    }

    const actorUrl = `https://api.apify.com/v2/acts/powerful_bachelor~instagram-post-details-scraper-ppr/runs?token=${apiKey}`;

    try {
        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postUrls: [url] }),
        });

        const data = await response.json();
        if (!data?.data?.id) throw new Error("Failed to start actor.");

        const datasetId = await pollRunStatus(data.data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        const result = await fetchActorResults(datasetId, apiKey);
        const output_data: IgPostOutput = {
            number_of_comments: result[0]?.comment_count,
            number_of_likes: result[0]?.like_count,
            username: result[0]?.owner.username,
            post_date: result[0]?.post_date,
            location: result[0]?.location,
            video: result[0]?.video_url,
            engagement_rate: "",
            number_of_played: result[0]?.video_play_count,
        };

        res.status(200).json({ data: output_data });
    } catch (err) {
        res.status(500).json({ error: "Actor run failed." });
    }
};
