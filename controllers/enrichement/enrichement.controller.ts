import axios from "axios";
import { Request, Response } from "express";
import Groq from "groq-sdk"; 
import dotenv from 'dotenv'
dotenv.config()
/**
 * Generates the request payload for LinkedIn's premium search API
 * @param {any} company_id - The ID of the company
 * @param {any} company_name - The name of the company
 * @param {any} [location_id=null] - The ID of the location (optional)
 * @param {any} [location_name=null] - The name of the location (optional)
 * @param {string[]} [seniority_levels=[]] - Array of seniority levels (optional)
 * @param {string} [keyword="job"] - Search keyword (default: "job")
 * @param {number} [page=1] - Page number (default: 1)
 * @returns {Object} - The request payload
 */
function generateLinkedInURL(
  company_id: any,
  company_name: any,
  location_id: any = null,
  location_name: any = null,
  seniority_levels: string[] = [],
  keyword: string = "job",
  page: number = 1
): object {
  const filters = [
    {
      type: "CURRENT_COMPANY",
      values: [
        {
          id: `urn:li:organization:${company_id}`,
          text: company_name,
          selectionType: "INCLUDED",
        },
      ],
    },
  ];

  // Add location filter if provided
  if (location_id && location_name) {
    filters.push({
      type: "GEO_REGION",
      values: [
        {
          id: `urn:li:geo:${location_id}`,
          text: location_name,
          selectionType: "INCLUDED",
        },
      ],
    });
  }

  if (seniority_levels && seniority_levels.length > 0) {
    const seniorityValues = seniority_levels.map((level) => {
      return {
        text: level,
        selectionType: "INCLUDED",
      };
    });

    filters.push({
      type: "SENIORITY_LEVEL",
      values: seniorityValues as any,
    });
  }

  return {
    account_number: 1,
    page,
    filters,
  };
}

/**
 * Express route handler to get possible hiring managers based on company and location.
 */
export const getPossibleHiringManager = async (req: Request, res: Response) => {
  const { company_name, location, seniority_levels, page = 1 } = req.body; // Extract request parameters
  const apiKey = req.headers["x-api-key"] as string; // Retrieve API key from headers

  // Validate required inputs
  if (!company_name || !location) {
    res.status(400).json({ error: "Company name and location are required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  /**
   * Fetches the company ID from LinkedIn API
   * @returns {Promise<{id: string, name: string} | undefined>}
   */
  async function getCompanyId(): Promise<{ id: string; name: string } | undefined> {
    try {
      const response = await axios.get(
        "https://linkedin-api8.p.rapidapi.com/get-company-details",
        {
          params: { username: company_name },
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
          },
        }
      );
      return { id: response.data.data.id, name: response.data.data.name };
    } catch (error) {
      console.error("Error fetching company ID:", error);
      return undefined;
    }
  }

  /**
   * Fetches the location ID from LinkedIn API
   * @returns {Promise<{id: string, name: string} | undefined>}
   */
  async function getLocationId(): Promise<{ id: string; name: string } | undefined> {
    try {
      const response = await axios.get(
        "https://linkedin-api8.p.rapidapi.com/search-locations",
        {
          params: { keyword: location },
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
          },
        }
      );
      const locationData = response.data.data.items[0];
      return {
        id: locationData.id.replace("urn:li:geo:", ""),
        name: locationData.name,
      };
    } catch (error) {
      console.error("Error fetching location ID:", error);
      return undefined;
    }
  }

  /**
   * Introduces a delay in execution
   * @param {number} ms - Time in milliseconds
   * @returns {Promise<void>}
   */
  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Fetch company and location IDs
  const comp_id = await getCompanyId();
  await delay(1000); // Delay to avoid rate limiting
  const loc_id = await getLocationId();

  // Handle missing company or location
  if (!comp_id || !loc_id) {
    res.status(404).json({ error: "Company or Location not found" });
    return;
  }

  // Generate LinkedIn search request payload with seniority levels if provided
  const requestPayload = generateLinkedInURL(
    comp_id.id,
    comp_id.name,
    loc_id.id,
    loc_id.name,
    seniority_levels || []
  );

  try {
    // Make API request to fetch hiring managers
    const response = await axios.post(
      "https://linkedin-sales-navigator-no-cookies-required.p.rapidapi.com/premium_search_person",
      requestPayload,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host":
            "linkedin-sales-navigator-no-cookies-required.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    // Send response back to client
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching hiring managers:", error);
    res
      .status(error.response?.status || 500)
      .json({ error: error.message });
  }
};

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




const groq = new Groq({
  apiKey:process.env.GROQ_API_KEY
})

async function generateText(recipient_data:any) {

  const { fullName, headline, summary, skills, positions, honors, study } = recipient_data;

  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role":"user",
        "content":`
          Generate a personalized icebreaker message for a job opportunity using the following details about the recipient:
          - **Full Name**: ${fullName}
          - **Headline**: ${headline}
          - **Summary**: ${summary}
          - **Key Skills**: ${skills.join(", ")}
          - **Recent Positions**: ${positions.join(" | ")}
          - **Honors & Awards**: ${honors.join(" | ")}
          - **Education**: ${study.join(" | ")}
          Make the message engaging, professional, and warm. Reference their background, skills, or recent work to create a connection. Keep it concise (around 2-3 sentences) and natural. Avoid being too generic or overly formal. If they have notable achievements, acknowledge them briefly. The goal is to start a meaningful conversation about potential job opportunities.    
        `
      }
    ],
    "model": "qwen-2.5-32b",
    "temperature": 0.6,
    "max_completion_tokens": 131072,
    "top_p": 0.95,
    "stream": false,
    "stop": null
  });

   return chatCompletion.choices[0].message.content;
}

export const generateIcebreaker = async (req: Request, res: Response) => {
  const { url } = req.body; // Extract LinkedIn profile URL from query parameters
  const apiKey = req.headers["x-api-key"] as string; // Extract API key from headers

  // Validate inputs
  if (!url) {
    res.status(400).json({ error: "LinkedIn profile URL is required" });
    return 
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url",
    params: { url },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const profile = response.data

     const recipient_data = {
    fullName : profile.firstName + ' ' + profile.lastName,
     headline : profile.headline,
     summary : profile.summary,
     skills : !profile.skills?[]:profile.skills.map((i:any)=>i.name),
     positions : !profile.position?[]:profile.position.map((p:any)=>{
      return `${p.title} at ${p.companyName} (${p.description})`
    }).slice(0,3),
     honors : !profile.honors?[]:profile.honors.map((h:any)=>`${h.title}:${h.description}`).slice(0,3),
     study : !profile.educations?[]:profile.educations.map((e:any)=>`Studied ${e.fieldOfStudy} ${e.degree} at ${e.schoolName}`).slice(0,3)
    }

    const message = await  generateText(recipient_data)

    res.status(200).json({message});
  } catch (error: any) {
        res
      .status(error.response?.status || 500)
      .json({ error: error.message });
  }
};
