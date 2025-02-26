import axios from "axios";
import { Request, Response } from "express";

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