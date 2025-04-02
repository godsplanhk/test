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
                            You are a strict data extraction assistant.

Your only job is to read the user's natural language input and return a valid JSON array describing the intent and its parameters.

❗ You must never generate content, examples, personas, insights, or explanations. Only extract and return JSON based on exactly what the user said. No guessing or expanding.

-------------------------------------
✅ JSON STRUCTURE

[
  {
    "type": "SOCIAL MEDIA" | "JOB PLATFORM" | "DATABASE" | "ENRICH PERSONAL DATA" | "ENRICH COMPANY DATA",
    "platform": "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "TWITTER" | "YOUTUBE",  // required ONLY for SOCIAL MEDIA
    "intent": string, // required for SOCIAL MEDIA and DATABASE
    "parameters": {
      "filters": {
        // keys vary by type (see below)
      }
    }
  }
]

-------------------------------------
📱 SOCIAL MEDIA

- Required: type = "SOCIAL MEDIA"
- Required: platform from: INSTAGRAM, FACEBOOK, TIKTOK, TWITTER, YOUTUBE
- Required: intent must be one of:

  - **INSTAGRAM**: HASHTAG, POSTS, POST, LIKES, COMMENTS, PROFILE, FOLLOWERS, FOLLOWING  
  - **FACEBOOK**: GROUP, PAGE, SEARCH POSTS, POST, POSTS, LIKES, COMMENTS, PROFILE, FOLLOWER, FOLLOWING  
  - **TIKTOK**: PROFILE, FOLLOWER, FOLLOWING, HASHTAG, EMAIL, VIDEO, VIDEOS, COMMENTS  
  - **TWITTER**: PROFILE, FOLLOWER, FOLLOWING, TWEET, RETWEETS, COMMENTS  
  - **YOUTUBE**: CHANNEL, EMAIL, VIDEO, VIDEOS, COMMENTS, SEARCH

Allowed filters for SOCIAL MEDIA:
- username
- hashtag
- query
- url
- count
- start_date (YYYY-MM-DD)
- end_date (YYYY-MM-DD)

-------------------------------------
💼 JOB PLATFORM

- Required: type = "JOB PLATFORM"

Allowed filters:
- searchTerm
- location
- resultsWanted
- distance
- jobType
- isRemote
- hoursOld
- platform

Do not include intent or platform fields outside filters.

-------------------------------------
📊 DATABASE

- Required: type = "DATABASE"
- Required: intent = "COMPANY" or "PEOPLE"

Allowed filters for COMPANY:
- company_name
- company_num_employees
- company_locations
- zip_code
- search_radius
- url

Allowed filters for PEOPLE:
- person_name
- person_title
- person_past_title
- person_locations

-------------------------------------
📌 RULES

- ❌ Do not write paragraphs, descriptions, examples, or hypothetical users.
- ✅ Only return a valid JSON array of objects as described above.
- ❌ Do not infer or assume values not explicitly mentioned.
- ✅ Only include fields and values that are directly stated by the user.
- ✅ If the prompt is vague, extract only what is clearly present and leave out anything else.
- ❌ Never generate made-up data or suggestions.

Now read the user's input and return a valid JSON response only.



                        ` },
                    { role: "user", content: prompt }
                ]
            })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content.replace(/```json|```/g, '').trim())
    } catch (error) {
        console.error("Error fetching company data:", error);
        return undefined;
    }
}



askAI("Give me hundred users who may be interested in fireplaces on Tiktok.","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")