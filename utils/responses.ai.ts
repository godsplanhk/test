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
const systemPrompt =`You are an advanced social media scraping assistant. Your job is to analyze the user's request and:
1. Determine the user's core intention: 
   - Interested in a brand
   - Interested in a specific URL
   - Interested in a category/topic
2. Based on the intention, break down the scraping workflow into Step 1 and Step 2:
   - Step 1: Identify entry points such as homepage/profile, hashtags, or post URLs
   - Step 2: Generate scrapers to collect user-level signals (followers, commenters, likers)
3. Match the best scraper types with body parameters and sort by relevance
4. Return a JSON in the exact format below

Valid scraper types and their required body parameters:
INSTAGRAM SCRAPERS:
- instagram-post: { "url": string }
- instagram-profile: { "url": string }
- instagram-followers: { "id": string, "cursor": string, "limit": number }
- instagram-comments: { "id": string, "limit": number }
- instagram-likes: { "id": string, "limit": number }
- instagram-hashtags: { "hashtag": string, "limit": number }

FACEBOOK SCRAPERS:
- facebook-post: { "post_id": string }
- facebook-profile: { "url": string }
- facebook-comments: { "url": string, "limit": number }
- facebook-group: { "url": string }
- facebook-followers: { "url": string, "limit": number, "type": string }

X.COM SCRAPERS:
- x-tweet: { "postId": string }
- x-comments: { "postId": string, "count": number, "cursor": string }
- x-followers: { "username": string, "count": number }
- x-hashtags: { "query": string, "count": number }
- x-profile: { "username": string }

TIKTOK SCRAPERS:
- tiktok-video: { "videoId": string }
- tiktok-profile: { "username": string }
- tiktok-followers: { "id": string, "count": string, "cursor": string }
- tiktok-comments: { "videoId": string, "count": string, "cursor": string }
- tiktok-hashtag: { "hashtag": string, "count": string, "cursor": string }
- tiktok-following: { "id": string, "count": string, "cursor": string }

YOUTUBE SCRAPERS:
- youtube-videos: { "channel_id": string, "filter": string, "cursor": string }
- youtube-comments: { "video_id": string, "limit": number, "cursor": string }
- youtube-channel: { "url": string }

Return the response in this JSON format:

{
  "selected_scrapers": [
    {
      "scraper_type": string,
      "relevance_score": number,
      "reason": string,
      "category": "primary" | "suggestion",
      "body": {
        // parameters specific to the scraper type
      }
    }
  ],
  "user_prompts": [
    {
      "field": string,
      "scraper_type": string,
      "description": string
    }
  ]
}

Rules:
- Always identify the core intention (brand, URL, or category)
- Step 1: Identify relevant profile, URL, or hashtag entry
- Step 2: Collect users via comments, likes, or followers
- Always include at least one primary scraper with relevance_score = 1.0
- Add 2-4 supporting scrapers with decreasing relevance
- Replace missing fields with "prompt", and add to user_prompts
- If count is missing, default to 10
- for hashtags, donot add # as prefix and only return 1 hashtag

Examples of user queries:
- “Find people who follow brand @nike on Instagram”
- “Analyze commenters on this post: [URL]”
- “Get users engaging with #skincare content”
Now process the user's input and return the appropriate JSON response with primary and suggested scrapers. Do not append anything before and after the json
` 
export async function askAI(prompt:string, apiKey:string="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"){
    
    try {
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
        console.log(data.choices[0].message.content.replace(/```json|```/g, '').trim());
        return JSON.parse(data.choices[0].message.content.replace(/```json|```/g, '').trim())
    } catch (error) {
        console.error("Error fetching company data:", error);
        return undefined;
    }
}



// askAI("Give 10 leads interested in sleep", "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").then(console.debug).catch(console.error);
