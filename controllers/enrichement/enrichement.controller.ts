import axios from "axios";
import { Request, Response } from "express";
import Groq from "groq-sdk"; 
import dotenv from 'dotenv'
import { API_KEYS } from "../../utils/apiKeys";
import { fetchCompanyData, generateIcebreakerFunction } from "../../utils/responses.ai";
import { generateLinkedInURL } from "../../utils/helpers";
dotenv.config()



/**
 * Express route handler to get possible hiring managers based on company and location.
 */
export const getPossibleHiringManager = async (req: Request, res: Response) => {
  const { company_name, location, seniority_levels, page = 1 } = req.body; // Extract request parameters

  // Validate required inputs
  if (!company_name || !location) {
    res.status(400).json({ error: "Company name and location are required" });
    return;
  }
  if (!API_KEYS.LINKEDIN_API_KEY) {
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
            "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
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
            "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
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
          "x-rapidapi-key": API_KEYS.LINKEDIN_SALES_NAVIGATOR_API_KEY,
          "x-rapidapi-host":
            "linkedin-sales-navigator-no-cookies-required.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    // Send response back to client
    res.status(200).json(response.data.response);
  } catch (error: any) {
    console.error("Error fetching hiring managers:", error);
    res
      .status(error.response?.status || 500)
      .json({ error: error.message });
  }
};


export const getJobHiringTeam= async(req:Request, res:Response)=>{
  const {job_id, job_url} = req.body
  if(!job_url || !job_id){
    res.status(400).json({error:"Either provide job url or job id"})
    return
  }

  try{
    const options = {
      method: 'GET',
      url: 'https://linkedin-api8.p.rapidapi.com/get-hiring-team',
      params: {
        id: '3903094332',
        url: 'https://www.linkedin.com/jobs/view/3903094332/'
      },
      headers: {
        'x-rapidapi-key': API_KEYS.LINKEDIN_API_KEY,
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
	  res.status(200).json({data:response.data.data.items})
  }
  catch{
    res.status(500).json({error:"An unexpected error occured."})
  }
}


/**
 * Express route handler to enrich company data based on a user's question.
 */
export const getEnrichedInformation = async (req: Request, res: Response) => {
    const { company_name, question } = req.body; // Extract request parameters
    const apiKey = process.env.PERPLEXITY_API_KEY; // Retrieve Perplexity AI API key
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




export const generateIcebreaker = async (req: Request, res: Response) => {
  const { url } = req.body; // Extract LinkedIn profile URL from query parameters

  // Validate inputs
  if (!url) {
    res.status(400).json({ error: "LinkedIn profile URL is required" });
    return 
  }
  if (!API_KEYS.LINKEDIN_API_KEY) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url",
    params: { url },
    headers: {
      "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
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

    const message = await  generateIcebreakerFunction(recipient_data, process.env.PERPLEXITY_API_KEY as string)

    res.status(200).json({message:message});
  } catch (error: any) {
        res
      .status(error.response?.status || 500)
      .json({ error: error.message });
  }
};

export const generateIcebreakerForJob = async(req:Request, res:Response) =>{

}