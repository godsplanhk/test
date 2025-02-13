import { IgFollowInput, IgProfileOutput, IgCommentsOutput } from "../../../types/social";
import { fetchActorResults, getLastPostDates, pollRunStatus, scrapeProfiles } from "../../../utils/actor";
import { Request, Response } from "express";

export const facebook_follow_scraper = async (req: Request, res: Response) => {
    try {
        const { url, limit, type } = req.body as IgFollowInput;
        const apiKey = req.headers["x-apify-api-key"] as string;
        let cookie = req.body.cookie;

        if (!url || !cookie || !type) {
            res.status(400).json({ "error": "Please provide the url / cookie / type" });
            return 
        }

        const payload = {
            startUrls: [
                {
                    url
                }
            ],
            followType: type == "followers"?"follower":"following",
            ...(limit && { resultsLimit: limit })
        };

        console.log(payload)

        const actorUrl = `https://api.apify.com/v2/acts/apify~facebook-followers-following-scraper/runs?token=${apiKey}`;

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

        if(result[0].error){
            res.status(400).json({error:"No follower extracted"})
            return
        }
        const usernames = result.map(user => user.url);
        console.log("usernames", usernames)
        const scrape_profiles = async () => {
            const profilePayload = {
                "profileUrls": usernames,
                proxy: { useApifyProxy: true},
                maxDelay:11,
                cookies:JSON.parse(cookie)
            };


            const actorUrl = `https://api.apify.com/v2/acts/curious_coder~facebook-profile-scraper/runs?token=${apiKey}`;

            try {
                const profileResponse = await fetch(actorUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(profilePayload),
                    })

                const profileData = await 
                    profileResponse.json()
                
                if (!profileData?.data?.id)
                    throw new Error("Failed to start actors.");
                
                const profileDatasetId = await pollRunStatus(profileData.data.id, apiKey)

                if (!profileDatasetId)
                    throw new Error("Failed to get dataset ID.");

                const profileResults = await fetchActorResults(profileDatasetId, apiKey)
                return profileResults
            } catch (error) {
                console.log(error);
                return null
            }
        };

        const scraped_profiles = await scrape_profiles()

        res.status(200).json({ data: scraped_profiles });

    } catch (error:any) {
        console.error(error);
        res.status(500).json({ "error": error?.message });
    }
};

