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