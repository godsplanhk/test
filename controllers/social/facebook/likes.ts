import { IgCommentsInput, IgCommentsOutput, IgProfileOutput } from "../../../types/social";
import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { Request, Response } from "express";

export const facebook_likes_scraper = async (req: Request, res: Response) => {
    const { url, limit, cookie } = req.body as IgCommentsInput;
    
    const apiKey = req.headers["x-apify-api-key"] as string;

    if (!url || ! cookie) {
        res.status(400).json({ "error": "Please provide the url" });
        return;
    }

    const payload = {
        postUrls:[
            {url}
        ],
        ...(limit && { amount: limit }),
        "proxy": {
        "useApifyProxy": false
        },
        cookies:cookie
    };
    try {
        const actorUrl = `https://api.apify.com/v2/acts/danny.hub~facebook-like-user-data-scraper/runs?token=${apiKey}`;
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
            username: postData?.profile,
            created_at: "",
        }));

        const usernames = output_data.map(i=>i.username)

        const scrape_profiles = async () => {
            const profilePayload = {
                "profileUrls": usernames,
                proxy: { useApifyProxy: true, apifyProxyCountry:"US" },
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
                // return usernames.map((username, i) => ({
                //     username:(profileResults[i]?.url || "").replace("https://www.facebook.com/",""),
                //     location: `${profileResults[i]?.address || ""}`.trim(),
                //     phone: profileResults[i]?.mobile ?? "",
                //     email: profileResults[i]?.email ?? "",
                //     number_of_follower: profileResults[i]?.followers,
                //     number_of_following: "",
                //     engagement_rate: "",
                //     created_at: "",
                // }));
            } catch (error) {
                console.log(error);
                res.status(500).json({ "error": "Actor run failed." });
            }
        };

        const scraped_profiles = await scrape_profiles();
        if (!scraped_profiles) throw Error("");

        // const finalOutput: Array<any> = scraped_profiles.map((profile, i) => ({
        //     username: profile?.username,
        //     created_at: output_data[i]?.created_at,
        //     number_of_follower: profile?.number_of_follower,
        //     number_of_following: profile?.number_of_following,
        //     location: profile?.location,
        //     email: profile?.email,
        //     phone: profile?.phone,
        //     engagement_rate: "",
        // }));

        res.status(200).json({ data: scraped_profiles });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": "Actor run failed." });
    }
};
