import { IgProfileInput, IgProfileOutput } from "../../../types/social";
import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { Request, Response } from "express";

export const facebook_profile_scraper = async (req: Request, res: Response) => {
    try {
        const { url, cookie } = req.body as IgProfileInput;
        const apiKey = req.headers["x-apify-api-key"] as string;
        const username = url

        if (!username || !cookie) {
            res.status(400).json({ error: "Please provide the username / cookie" });
            return 
        }

        const payload = {
            "profileUrls": [username],
            proxy: { useApifyProxy: true, apifyProxyCountry:"US" },
            maxDelay:11,
            cookies:JSON.parse(cookie)
        };

        console.log(payload)

        const actorUrl = `https://api.apify.com/v2/acts/curious_coder~facebook-profile-scraper/runs?token=${apiKey}`;

        // Start profile scraper actor
        const profileResponse = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const profileData = await profileResponse.json();
        if (!profileData?.data?.id) throw new Error("Failed to start profile scraper actor.");

        // Poll status and fetch results concurrently
        const datasetIdPromise = pollRunStatus(profileData.data.id, apiKey);
        const datasetId = await datasetIdPromise;
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        const profileResults = await fetchActorResults(datasetId, apiKey);

        // Run both fetch calls in parallel

        if (!profileResults) throw new Error("No profile data found.");



        res.status(200).json({ data: profileResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error || "Actor run failed." });
    }
};
