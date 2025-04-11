import { DatabaseAssistantPrompt, socialMediaAssistantPrompt } from "./system.prompt";

/**
 * Fetches enriched company data using Perplexity AI API based on a specific question.
 * @param {string} companyName - The name of the company to fetch information about.
 * @param {string} question - The specific question to ask about the company.
 * @param {string} apiKey - Perplexity AI API key.
 * @returns {Promise<any | undefined>} - The AI-generated response or undefined in case of an error.
 */
export async function fetchCompanyData(companyName: string, question: string, apiKey: string): Promise<string | undefined> {
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

export async function generateIcebreakerFunction(recipient_data: any, apiKey: string) {
    const { fullName, headline, summary, skills, positions, honors, study } = recipient_data;
    try {
        const options = {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: "Be precise and concise." },
                    {
                        role: "user", content: `
          Generate a personalized icebreaker message for a job opportunity using the following details about the recipient:
          - **Full Name**: ${fullName}
          - **Headline**: ${headline}
          - **Summary**: ${summary}
          - **Key Skills**: ${skills.join(", ")}
          - **Recent Positions**: ${positions.join(" | ")}
          - **Honors & Awards**: ${honors.join(" | ")}
          - **Education**: ${study.join(" | ")}
          Make the message engaging, professional, and warm. Reference their background, skills, or recent work to create a connection. Keep it concise (around 2-3 sentences) and natural. Avoid being too generic or overly formal. If they have notable achievements, acknowledge them briefly. The goal is to start a meaningful conversation about potential job opportunities. Don't include in the response that it is a icebreaker just include the message which can be directly sent to that person.    
        ` }
                ]
            })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching company data:", error);
        return undefined;
    }
}
export async function askAI(prompt: string, scenario: string, apiKey: string = "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") {
    console.log(scenario);
    let systemPrompt = "";
    switch (scenario) {
        case "database":
            systemPrompt = DatabaseAssistantPrompt;
            break;
        case "social":
            systemPrompt = socialMediaAssistantPrompt;
            break;
        default:
            systemPrompt = socialMediaAssistantPrompt;
    }
    try {
        console.log(systemPrompt);
        const options = {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ]
            })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);
        const data = await response.json();
        console.log(data.choices[0].message.content)
        return JSON.parse(data.choices[0].message.content.replace(/```json|```/g, '').trim());
    } catch (error) {
        console.error("Error fetching company data:", error);
        return undefined;
    }
}



askAI("10 leads for my electrical shops", "social", "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").then(console.debug).catch(console.error);
