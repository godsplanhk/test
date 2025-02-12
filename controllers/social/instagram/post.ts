import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { IgPostInput, IgPostOutput } from "../../../types/social";
import { Request, Response } from "express";

export const ig_post_scraper = async (req: Request, res: Response) => {
    try {
        const { url } = req.body as IgPostInput;
        const apiKey = req.headers["x-apify-api-key"] as string;

        if (!url) {
            res.status(400).json({ error: "URL not provided in the body" });
            return
    }

        const actorUrl = `https://api.apify.com/v2/acts/powerful_bachelor~instagram-post-details-scraper-ppr/runs?token=${apiKey}`;

        // Start actor and poll in parallel
        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postUrls: [url] }),
        });

        let data  = await response.json();
        data = data.data
        if (!data?.id) throw new Error("Failed to start actor.");

        // Poll status while waiting for actor results
        const datasetId = await pollRunStatus(data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        // Fetch and process results
        const result = await fetchActorResults(datasetId, apiKey);
        const postData = result[0];

        if (!postData) throw new Error("No data received from actor.");

        res.status(200).json({
            data: {
                number_of_comments: postData.comment_count ?? 0,
                number_of_likes: postData.like_count ?? 0,
                username: postData.owner?.username ?? "",
                post_date: postData.post_date ?? "",
                location: postData.location ?? "",
                video: postData.video_url ?? "",
                engagement_rate: "",
                number_of_played: postData.video_play_count ?? 0,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err || "Actor run failed." });
    }
};
