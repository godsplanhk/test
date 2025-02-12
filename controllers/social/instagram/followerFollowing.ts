import { IgFollowInput, IgProfileOutput, IgCommentsOutput } from "../../../types/social";
import { fetchActorResults, getLastPostDates, pollRunStatus, scrapeProfiles } from "../../../utils/actor";
import { Request, Response } from "express";

export const ig_follow_scraper = async (req: Request, res: Response) => {
    try {
        const { url, limit, type } = req.body as IgFollowInput;
        const apiKey = req.headers["x-apify-api-key"] as string;
        let cookie = req.body.cookie;

        if (!url || !cookie || !type) {
            res.status(400).json({ "error": "Please provide the url / cookie / type" });
            return 
        }

        const payload = {
            action: "scrapeFriendships",
            "scrapeFriendships.profile": url,
            "scrapeFriendships.friendshipType": type,
            proxy: {
                useApifyProxy: true,
                apifyProxyGroups: ["RESIDENTIAL"]
            },
            cookie: JSON.parse(cookie),
            ...(limit && { count: limit })
        };

        const actorUrl = `https://api.apify.com/v2/acts/curious_coder~instagram-scraper/runs?token=${apiKey}`;

        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!data?.data?.id) throw new Error("Failed to start actor.");

        const datasetId = await pollRunStatus(data.data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        const result = await fetchActorResults(datasetId, apiKey);
        if (!result || result.length === 0) throw new Error("No data received.");

        const usernames = result.slice(0, limit).map(post => post.username);

        // Run both profile and last post scraping in parallel
        const [profileResults, lastPostDates] = await Promise.all([
            scrapeProfiles(usernames, cookie, apiKey),
            getLastPostDates(usernames, apiKey)
        ]);

        // Merge results efficiently
        const finalOutput: IgCommentsOutput[] = profileResults.map((profile, i) => ({
            username: profile?.username || usernames[i],
            created_at: "",
            last_post_date: lastPostDates[i] || "",
            number_of_follower: profile?.number_of_follower || 0,
            number_of_following: profile?.number_of_following || 0,
            location: profile?.location || "",
            email: profile?.email || "",
            phone: profile?.phone || "",
            engagement_rate: ""
        }));

        res.status(200).json({ data: finalOutput });

    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Actor run failed." });
    }
};

