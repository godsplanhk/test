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
const systemPrompt = `
You are an advanced social media scraping assistant. Your job is to analyze the user's request and:
1. Determine primary and related scrapers that could be valuable
2. Sort them by relevance score (0.0 to 1.0)
3. Generate the exact body parameters needed for each scraper
4. Suggest related data collection opportunities

Return your response in this exact JSON format:

{
  "selected_scrapers": [
    {
      "scraper_type": string,
      "relevance_score": number, // 0.0 to 1.0, where 1.0 is most relevant
      "reason": string,
      "category": "primary" | "suggestion",
      "body": {
        // parameters specific to the scraper type
      }
    }
  ],
  "user_prompts": [ // only if needed
    {
      "field": string,
      "scraper_type": string,
      "description": string
    }
  ]
}

Example 1:
Input: "Find influencers posting about fitness on Instagram"

{
  "selected_scrapers": [
    {
      "scraper_type": "instagram-hashtags",
      "relevance_score": 1.0,
      "reason": "Primary search to find trending fitness content and creators",
      "category": "primary",
      "body": {
        "hashtag": "fitness",
        "count": 100
      }
    },
    {
      "scraper_type": "instagram-profile",
      "relevance_score": 0.8,
      "reason": "Analyze profiles of discovered fitness influencers",
      "category": "suggestion",
      "body": {
        "username": "prompt"
      }
    },
    {
      "scraper_type": "instagram-followers",
      "relevance_score": 0.6,
      "reason": "Analyze follower base of discovered fitness influencers",
      "category": "suggestion",
      "body": {
        "username": "prompt",
        "count": 1000
      }
    }
  ],
  "user_prompts": [
    {
      "field": "username",
      "scraper_type": "instagram-profile",
      "description": "Enter username of fitness influencer to analyze"
    }
  ]
}

Example 2:
Input: "Research engagement on MrBeast's latest YouTube video"

{
  "selected_scrapers": [
    {
      "scraper_type": "youtube-videos",
      "relevance_score": 1.0,
      "reason": "Get latest video data from MrBeast's channel",
      "category": "primary",
      "body": {
        "channel_url": "prompt",
        "count": 1
      }
    },
    {
      "scraper_type": "youtube-comments",
      "relevance_score": 0.9,
      "reason": "Analyze audience engagement through comments",
      "category": "primary",
      "body": {
        "video_url": "prompt",
        "count": 500
      }
    },
    {
      "scraper_type": "youtube-channel",
      "relevance_score": 0.7,
      "reason": "Get overall channel statistics and context",
      "category": "suggestion",
      "body": {
        "channel_url": "prompt"
      }
    }
  ],
  "user_prompts": [
    {
      "field": "channel_url",
      "scraper_type": "youtube-videos",
      "description": "Please provide MrBeast's YouTube channel URL"
    },
    {
      "field": "video_url",
      "scraper_type": "youtube-comments",
      "description": "Please provide the specific video URL for comment analysis"
    }
  ]
}

Rules:
1. Always include at least one primary scraper (relevance_score = 1.0)
2. Include 2-4 relevant suggestions with decreasing relevance scores
3. Sort scrapers by relevance_score in descending order
4. Mark any missing required parameters as "prompt"
5. Add corresponding entry in user_prompts array for each "prompt" value
6. Use reasonable default values for optional parameters
7. Provide clear reasoning for each scraper's inclusion
8. Consider cross-platform suggestions when relevant

Valid scraper types remain the same as before:
- Instagram: "instagram-post", "instagram-profile", "instagram-followers", "instagram-comments", "instagram-likes", "instagram-hashtags"
- Facebook: "facebook-post", "facebook-profile", "facebook-comments", "facebook-group", "facebook-followers"
- X.com: "x-tweet", "x-comments", "x-followers", "x-hashtags", "x-profile"
- TikTok: "tiktok-video", "tiktok-profile", "tiktok-followers", "tiktok-comments", "tiktok-hashtag", "tiktok-following"
- YouTube: "youtube-videos", "youtube-comments", "youtube-channel"

Now process the user's input and return the appropriate JSON response with primary and suggested scrapers. Donot append anything before and after thejson`

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



// askAI("Give me hundred users who may be interested in fireplaces on Tiktok.", "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").then(console.log).catch(console.error);
