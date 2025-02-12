export const pollRunStatus = async (runId: string, apiKey: string): Promise<string | null> => {
    const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`;

    while (true) {
        await new Promise((res) => setTimeout(res, 5000));

        try {
            const res = await fetch(statusUrl);
            const runData = await res.json();

            if (runData.data.status === "SUCCEEDED") {
                return runData.data.defaultDatasetId;
            }
            if (["FAILED", "ABORTED"].includes(runData.data.status)) {
                throw new Error(`Actor run failed: ${runData.data.status}`);
            }
        } catch (error) {
            throw new Error(`Error fetching run status: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};

export const fetchActorResults = async (datasetId: string, apiKey: string): Promise<any[]> => {
    try {
        const resultUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}`;
        const res = await fetch(resultUrl);
        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format received from API.");
        }

        return data;
    } catch (error) {
        throw new Error(`Error fetching results: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export async function scrapeProfiles(usernames: string[], cookie: string, apiKey: string) {
    try {
        const payload = {
            action: "scrapeProfiles",
            "scrapeProfiles.profileList": usernames,
            proxy: {
                useApifyProxy: true,
                apifyProxyGroups: ["RESIDENTIAL"]
            },
            cookie: JSON.parse(cookie)
        };

        const actorUrl = `https://api.apify.com/v2/acts/curious_coder~instagram-scraper/runs?token=${apiKey}`;
        const response = await fetch(actorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!data?.data?.id) throw new Error("Failed to start profile actor.");

        const datasetId = await pollRunStatus(data.data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get profile dataset ID.");

        const result = await fetchActorResults(datasetId, apiKey);
        return result.map(profile => ({
            username: profile.input,
            location: `${profile.address_street || ""} ${profile.city_name || ""}`.trim(),
            phone: profile.contact_phone_number || profile.public_phone_number || "",
            email: profile.public_email || "",
            number_of_follower: profile.follower_count || 0,
            number_of_following: profile.following_count || 0
        }));

    } catch (error) {
        console.error("Profile scraping failed:", error);
        return [];
    }
}

export async function getLastPostDates(usernames: string[], apiKey: string) {
    try {
        const payload = { username: usernames, resultsLimit: 1 };

        const lastPostActorUrl = `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs?token=${apiKey}`;
        const response = await fetch(lastPostActorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!data?.data?.id) throw new Error("Failed to start last post actor.");

        const datasetId = await pollRunStatus(data.data.id, apiKey);
        if (!datasetId) throw new Error("Failed to get last post dataset ID.");

        const result = await fetchActorResults(datasetId, apiKey);
        return result.map(post => post.timestamp || "");

    } catch (error) {
        console.error("Fetching last post dates failed:", error);
        return [];
    }
}
