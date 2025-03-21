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
