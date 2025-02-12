import { IgCommentsInput, IgCommentsOutput, IgProfileOutput } from "../../../types/social";
import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { Request, Response } from "express";

export const ig_comment_scraper = async (req: Request, res: Response) => {
    const { url, limit } = req.body as IgCommentsInput;
    let cookie = req.body.cookie;
    const apiKey = req.headers["x-apify-api-key"] as string;

    if (!url || !cookie) {
        res.status(400).json({ "error": "Please provide the url / cookie" });
        return;
    }

    const payload = {
        action: "scrapeCommentsOfPost",
        "scrapeCommentsOfPost.url": url,
        proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
        cookie: JSON.parse(cookie),
        ...(limit && { count: limit }),
    };

    try {
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

        const output_data = result.map((postData: any) => ({
            username: postData.user.username,
            created_at: postData.created_at,
        }));

        const usernames = output_data.map(i => i.username).slice(0, limit);

        console.log(usernames);

        const scrape_profiles = async () => {
            const profilePayload = {
                action: "scrapeProfiles",
                "scrapeProfiles.profileList": usernames,
                proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
                cookie: JSON.parse(cookie as string),
            };

            const postPayload = {
                username: usernames,
                resultsLimit: 1,
            };

            const actorUrl = `https://api.apify.com/v2/acts/curious_coder~instagram-scraper/runs?token=${apiKey}`;
            const lastPostActorUrl = `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs?token=${apiKey}`;

            try {
                const [profileResponse, postResponse] = await Promise.all([
                    fetch(actorUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(profilePayload),
                    }),
                    fetch(lastPostActorUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(postPayload),
                    }),
                ]);

                const [profileData, postData] = await Promise.all([
                    profileResponse.json(),
                    postResponse.json(),
                ]);

                if (!profileData?.data?.id || !postData?.data?.id)
                    throw new Error("Failed to start actors.");

                const [profileDatasetId, postDatasetId] = await Promise.all([
                    pollRunStatus(profileData.data.id, apiKey),
                    pollRunStatus(postData.data.id, apiKey),
                ]);

                if (!profileDatasetId || !postDatasetId)
                    throw new Error("Failed to get dataset ID.");

                const [profileResults, postResults] = await Promise.all([
                    fetchActorResults(profileDatasetId, apiKey),
                    fetchActorResults(postDatasetId, apiKey),
                ]);

                return usernames.map((username, i) => ({
                    username: profileResults[i]?.input,
                    location: `${profileResults[i]?.address_street || ""} ${profileResults[i]?.city_name || ""}`.trim(),
                    phone: profileResults[i]?.contact_phone_number || profileResults[i]?.public_phone_number,
                    email: profileResults[i]?.public_email,
                    number_of_follower: profileResults[i]?.follower_count,
                    number_of_following: profileResults[i]?.following_count,
                    engagement_rate: "",
                    created_at: "",
                    last_post_date: postResults[i]?.timestamp,
                }));
            } catch (error) {
                console.log(error);
                res.status(500).json({ "error": "Actor run failed." });
            }
        };

        const scraped_profiles = await scrape_profiles();
        if (!scraped_profiles) throw Error("");

        const finalOutput: IgCommentsOutput[] = scraped_profiles.map((profile, i) => ({
            username: profile?.username,
            created_at: output_data[i]?.created_at,
            last_post_date: profile?.last_post_date,
            number_of_follower: profile?.number_of_follower,
            number_of_following: profile?.number_of_following,
            location: profile?.location,
            email: profile?.email,
            phone: profile?.phone,
            engagement_rate: "",
        }));

        res.status(200).json({ data: finalOutput });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": "Actor run failed." });
    }
};
