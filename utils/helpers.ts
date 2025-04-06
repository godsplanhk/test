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

// Assuming `data` contains the parsed JSON content from app.json
type UserObject = Record<string, any>;

interface ExtractedData {
  users: UserObject[];
  rank_token: string | null;
  next_max_id: string | null;
  reels_max_id: string | null;
}

export function extractFullUserData(data: any): ExtractedData {
  const users: UserObject[] = [];
  let rank_token: string | null = null;
  let next_max_id: string | null = null;
  let reels_max_id: string | null = null;

  function recurse(obj: any): void {
    if (Array.isArray(obj)) {
      obj.forEach(item => recurse(item));
    } else if (obj && typeof obj === 'object') {
      // Capture metadata only once, if not already set
      if (obj.rank_token && rank_token === null) rank_token = obj.rank_token;
      if (obj.next_max_id && next_max_id === null) next_max_id = obj.next_max_id;
      if (obj.reels_max_id && reels_max_id === null) reels_max_id = obj.reels_max_id;

      for (const [key, value] of Object.entries(obj)) {
        if (key === 'user' && typeof value === 'object' && value !== null) {
          users.push(value);
        } else {
          recurse(value);
        }
      }
    }
  }

  recurse(data);

  return {
    users,
    rank_token,
    next_max_id,
    reels_max_id
  };
}

// Example usage:
// const fs = require('fs');
// const data = JSON.parse(fs.readFileSync('test.json', 'utf8'));
// const users = extractUserObjectsWithMetadata(data);
// console.log(users);


// Example usage:
// const jsonData = require('./app.json');
// const result = extractFullUserData(jsonData);
// console.log(result);

import _ from 'lodash';

type UserListResponse = {
  users: any[];
  rank_token?: string;
  next_max_id?: string;
  reels_max_id?: string;
};

export function extractUserListDataX(data: any): UserListResponse {
  const userList: any[] = [];
  let rank_token: string | undefined;
  let next_max_id: string | undefined;
  let reels_max_id: string | undefined;

  function recurse(obj: any) {
    if (obj && typeof obj === 'object') {
      // Check if current object has a 'user_list' property
      if ('user_list' in obj && Array.isArray(obj.user_list)) {
        for (const item of obj.user_list) {
          if (item.user) {
            userList.push(item.user);
          }
        }
      }

      // Collect metadata if found
      if ('rank_token' in obj && !rank_token) rank_token = obj.rank_token;
      if ('next_max_id' in obj && !next_max_id) next_max_id = obj.next_max_id;
      if ('reels_max_id' in obj && !reels_max_id) reels_max_id = obj.reels_max_id;

      // Recurse into object properties
      for (const key of Object.keys(obj)) {
        recurse(obj[key]);
      }
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        recurse(item);
      }
    }
  }

  recurse(data);

  return {
    users: userList,
    rank_token,
    next_max_id,
    reels_max_id
  };
}

interface Media {
  display_url: string;
  id_str: string;
  media_key: string;
  media_url_https: string;
  type: string;
  url: string;
}

interface User {
  // You can further define this based on your need
  [key: string]: any;
}

interface TweetEntry {
  media: Media[];
  user: User;
}

export function extractMediaUserPairsX(data: any): TweetEntry[] {
  const output: TweetEntry[] = [];

  const instructions = data?.result?.timeline?.instructions || [];
  for (const instruction of instructions) {
    const entries = instruction.entries || [];
    for (const entry of entries) {
      const tweetResult = entry?.content?.itemContent?.tweet_results?.result;
      const user = tweetResult?.core?.user_results?.result;
      const mediaArray = tweetResult?.legacy?.extended_entities?.media;

      if (mediaArray && user) {
        const filteredMedia = mediaArray.map((media: any) => ({
          display_url: media.display_url,
          id_str: media.id_str,
          media_key: media.media_key,
          media_url_https: media.media_url_https,
          type: media.type,
          url: media.url,
        }));

        output.push({ media: filteredMedia, user });
      }
    }
  }

  return output;
}

type MediaUserEntry = {
  media: {
    id: string;
    like_count: number;
    comment_count: number;
    taken_at: string;
  };
  user: {
    username: string;
    full_name: string;
    profile_pic_url: string;
  };
};

export function extractFacebookSearchResults(data: any) {
  const res:any = data.media_grid.sections[0].layout_content
  const finalMedia: any[] =[]
  const oneByTwo = res["one_by_two_item"]["clips"]["items"]
  oneByTwo.forEach((item:any) => {
    finalMedia.push({media:item["media"], user:item["user"]})
  })
  res["fill_items"].forEach((item:any) => {
    finalMedia.push({media:item["media"], user:item["user"]})
  })

  return finalMedia
}
