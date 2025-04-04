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

export async function generateIcebreakerFunction(recipient_data:any, apiKey:string){
    const { fullName, headline, summary, skills, positions, honors, study } = recipient_data;
    try {
        const options = {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: "Be precise and concise." },
                    { role: "user", content: `
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


export async function askAI(prompt:string, apiKey:string){
    
    try {
        const options = {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: `
Overview:
User input (natural language) → AI interprets intent → RAG matches sources → System builds scraper execution plan

Step 1: Build a Data Source Knowledge Base
Create a structured list of all supported data sources with their capabilities and strengths.

Example:
{
"crunchbase": {
"can_fetch": ["funding stage", "industry", "company location"],
"best_for": ["startup", "recently funded", "series A", "valuation"]
},
"linkedin_jobs": {
"can_fetch": ["hiring role", "job title", "company"],
"best_for": ["hiring", "team expanding", "open positions"]
},
"instagram": {
"can_fetch": ["followers", "engagement", "follows"],
"best_for": ["influencer", "social behavior", "engaged users"]
}
}

Step 2: Parse the Natural Language Prompt
Use a prompt-based LLM (e.g., GPT) to convert user input into structured fields.

Prompt Template:
"You're a lead generation AI.
User input: 'Find recently funded SaaS companies in the US hiring marketers.'
Step 1: Identify the task
Step 2: Extract filters (industry, funding, hiring, location)
Step 3: Suggest matching sources from the knowledge base
Step 4: Output structured JSON"

Expected Output:
{
"intent": "find_company",
"filters": {
"industry": "SaaS",
"funding": "recent",
"location": "USA",
"hiring_role": "marketing"
}
}

Step 3: Match Data Sources (RAG or Rules)
Use keyword mapping or vector retrieval to connect filters to source capabilities.

Example Output:
{
"data_sources": ["crunchbase", "linkedin_jobs"],
"reasoning": {
"crunchbase": "Provides funding and industry data",
"linkedin_jobs": "Detects hiring activity"
}
}

Step 4: Generate Scraper Execution Instructions
Translate the matched data sources and filters into structured scraper tasks.

Final Instruction:
[
{
"source": "crunchbase",
"query": {
"industry": "SaaS",
"location": "USA",
"funding": "recent"
}
},
{
"source": "linkedin_jobs",
"query": {
"role": "Marketing",
"company_type": "SaaS",
"location": "USA"
}
}
]

Summary:

Use a small, curated knowledge base for fast lookup or retrieval

Parse user input with structured prompting and example-guided formatting

Match to sources using rules or vector search (RAG)

Generate execution plans that the backend can directly run



                        ` },
                    { role: "user", content: prompt }
                ]
            })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);
        const data = await response.json();
        return data.choices[0].message.content.replace(/```json|```/g, '').trim()
    } catch (error) {
        console.error("Error fetching company data:", error);
        return undefined;
    }
}



askAI("Give me hundred users who may be interested in fireplaces on Tiktok.","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")