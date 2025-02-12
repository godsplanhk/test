import { IgLikesInput, IgLikesOutput, IgProfileOutput } from "../../../types/social";
import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { Request, Response } from "express";

export const ig_likes_scraper = async (req: Request, res: Response) => {
    try {
        const { url, limit } = req.body as IgLikesInput;
        const apiKey = req.headers["x-apify-api-key"] as string;
        const cookie = JSON.parse(req.body.cookie || "{}");

        if (!url || !cookie) {
            res.status(400).json({ error: "Please provide the url / cookie" });
            return 
        }

        const actorUrl = `https://api.apify.com/v2/acts/curious_coder~instagram-scraper/runs?token=${apiKey}`;
        const lastPostActorUrl = `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs?token=${apiKey}`;

        const payload = {
            action: "scrapeLikesOfPost",
            "scrapeLikesOfPost.url": url,
            proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
            cookie,
            ...(limit && { count: limit }),
        };

        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        let data = await response.json();
        data = data.data
        if (!data?.id) throw new Error("Failed to start actor.");

        const datasetId = await pollRunStatus(data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get dataset ID.");

        const results = await fetchActorResults(datasetId, apiKey);

        const usernames = results.slice(0, limit).map((postData) => postData.user.username);

        const scrapeProfilesPayload = {
            action: "scrapeProfiles",
            "scrapeProfiles.profileList": usernames,
            proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
            cookie,
        };

        // Parallel API Calls
        const [profileResponse, lastPostResponse] = await Promise.all([
            fetch(actorUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(scrapeProfilesPayload),
            }),
            fetch(lastPostActorUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: usernames, resultsLimit: 1 }),
            }),
        ]);

        const profileData = await profileResponse.json();
        const lastPostData = await lastPostResponse.json();

        if (!profileData?.data?.id || !lastPostData?.data?.id) throw new Error("Failed to start actors.");

        const [profileDatasetId, lastPostDatasetId] = await Promise.all([
            pollRunStatus(profileData.data.id, apiKey),
            pollRunStatus(lastPostData.data.id, apiKey),
        ]);

        if (!profileDatasetId || !lastPostDatasetId) throw new Error("Failed to get dataset IDs.");

        const [profileResults, lastPostResults] = await Promise.all([
            fetchActorResults(profileDatasetId, apiKey),
            fetchActorResults(lastPostDatasetId, apiKey),
        ]);

        const outputData: IgLikesOutput[] = usernames.map((username, i) => ({
            username,
            created_at: results[i]?.created_at || "",
            last_post_date: lastPostResults[i]?.timestamp || "",
            number_of_follower: profileResults[i]?.follower_count || 0,
            number_of_following: profileResults[i]?.following_count || 0,
            location: `${profileResults[i]?.address_street || ""} ${profileResults[i]?.city_name || ""}`.trim(),
            email: profileResults[i]?.public_email || "",
            phone: profileResults[i]?.contact_phone_number || profileResults[i]?.public_phone_number || "",
            engagement_rate: "",
        }));

        res.status(200).json({ data: outputData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Actor run failed." });
    }
};
