import axios from "axios";
import { API_KEYS } from "./apiKeys";

export const convertTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
  export const convertSecondsToHHMMSS = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  };

  export const searchLinkedInLocations = async (location_str:string,) => {
  
    if (!location_str) {
      return false
    }
  
    const options = {
      method: "GET",
      url: "https://linkedin-api8.p.rapidapi.com/search-locations",
      params: { keyword: location_str },
      headers: {
        "x-rapidapi-key": API_KEYS.LINKEDIN_API_KEY,
        "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
      },
    };
  
    try {
      const response = await axios.request(options);
      let loc = response.data.data.items[0]
      loc = loc.id.replace("urn:li:geo:","")
      return loc
    } catch (error: any) {
      return false
    }
  };



export function convertTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
}

// Function to generate a random date greater than or equal to a given timestamp
export function generateRandomDate(timestamp: number): string {
  const minDate = new Date(timestamp * 1000);
  const maxDate = new Date(); // Current date
  const randomDate = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()));
  return randomDate.toISOString().split('T')[0];
}

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
export function generateLinkedInURL(
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