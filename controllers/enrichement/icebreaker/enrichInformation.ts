import axios from "axios";
import { Request, Response } from "express";

/**
 * Fetches enriched company data using Perplexity AI API based on a specific question.
 * @param {string} companyName - The name of the company to fetch information about.
 * @param {string} question - The specific question to ask about the company.
 * @param {string} apiKey - Perplexity AI API key.
 * @returns {Promise<any | undefined>} - The AI-generated response or undefined in case of an error.
 */
async function fetchCompanyData(companyName: string, question: string, apiKey: string): Promise<string | undefined> {
    try {
        const options = {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: "Be precise and concise." },
                    { role: "user", content: `About ${companyName}: ${question}` }
                ]
            })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching company data:", error);
        return undefined;
    }
}

/**
 * Express route handler to enrich company data based on a user's question.
 */
export const getEnrichedInformation = async (req: Request, res: Response) => {
    const { company_name, question } = req.body; // Extract request parameters
    const apiKey = req.headers["x-api-key"] as string; // Retrieve API key from headers

    // Validate inputs
    if (!company_name || !question) {
        res.status(400).json({ error: "Company name and question are required" });
        return;
    }
    if (!apiKey) {
        res.status(400).json({ error: "API key is required" });
        return;
    }

    // Fetch enriched data from Perplexity AI
    const enrichedData = await fetchCompanyData(company_name, question, apiKey);

    if (!enrichedData) {
        res.status(500).json({ error: "Failed to retrieve company insights" });
        return;
    }

    res.status(200).json({ company: company_name, insights: (enrichedData as any).choices[0].message.content });
};
