import { IgProfileInput, IgProfileOutput } from "../../../types/social";
import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { Request, Response } from "express";

export const ig_profile_scraper = async (req: Request, res: Response) => {
    try {
        const { url, cookie } = req.body as IgProfileInput;
        const apiKey = req.headers["x-apify-api-key"] as string;
        const username = url.replace("https://instagram.com/", "").replace("/", "");

        if (!username || !cookie) {
            res.status(400).json({ error: "Please provide the username / cookie" });
            return 
        }

        const payload = {
            action: "scrapeProfiles",
            "scrapeProfiles.profileList": [username],
            proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
            cookie: JSON.parse(cookie),
        };

        const actorUrl = `https://api.apify.com/v2/acts/curious_coder~instagram-scraper/runs?token=${apiKey}`;
        const lastPostActorUrl = `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs?token=${apiKey}`;

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

        const profileResultsPromise = fetchActorResults(datasetId, apiKey);

        // Function to fetch last post date
        const getLastPostDate = async () => {
            const lastPostResponse = await fetch(lastPostActorUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: [username], resultsLimit: 1 }),
            });

            const lastPostData = await lastPostResponse.json();
            if (!lastPostData?.data?.id) throw new Error("Failed to start last post scraper actor.");

            const lastPostDatasetId = await pollRunStatus(lastPostData.data.id, apiKey);
            if (!lastPostDatasetId) throw new Error("Failed to get dataset ID.");

            const lastPostResults = await fetchActorResults(lastPostDatasetId, apiKey);
            return lastPostResults[0]?.timestamp || "";
        };

        // Run both fetch calls in parallel
        const [profileResults, lastPostDate] = await Promise.all([profileResultsPromise, getLastPostDate()]);

        if (!profileResults[0]) throw new Error("No profile data found.");

        const result = profileResults[0];

        const outputResult: IgProfileOutput = {
            username:username.replace("https:/www.instagram.com/","").replace("/",""),
            location: `${result.address_street || ""} ${result.city_name || ""}`.trim(),
            phone: result.contact_phone_number || result.public_phone_number || "",
            email: result.public_email || "",
            number_of_follower: result.follower_count || 0,
            number_of_following: result.following_count || 0,
            engagement_rate: "",
            created_at: "",
            last_post_date: lastPostDate,
        };

        res.status(200).json({ data: outputResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error || "Actor run failed." });
    }
};
