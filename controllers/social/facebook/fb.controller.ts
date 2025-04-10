import axios from "axios";
import { Request, Response } from "express";
import { API_KEYS } from "../../../utils/apiKeys";
import { extractFacebookSearchResults } from "../../../utils/helpers";

export const facebook_group_scraper = async (req: Request, res: Response) => {
    const groupUrl = req.body.url;
    
    
    if (!groupUrl || !API_KEYS.FACEBOOK_API_KEY) {
        res.status(400).json({ error: 'url and x-api-key header are required' });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/group/details',
        params: { url: groupUrl },
        headers: {
            'x-rapidapi-key': API_KEYS.FACEBOOK_API_KEY,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.group_details});
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

export const facebook_page_scraper = async (req: Request, res: Response) => {
    const { url } = req.body; // Get Facebook page URL from request body
     // API key from request headers

    if (!url) {
        res.status(400).json({ error: "Please provide a Facebook page URL" });
        return;
    }

    if (!API_KEYS.FACEBOOK_API_KEY) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/page/details',
        params: { url },
        headers: {
            'x-rapidapi-key': API_KEYS.FACEBOOK_API_KEY,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.results});
        return;
    } catch (error: any) {
        console.error("Error fetching Facebook page details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};

export async function facebook_search(req: Request, res: Response) {
    const { query, page_token, count } = req.body;
    
  
    if (!API_KEYS.INSTAGRAM_API_KEY || !query) {
      res.status(400).json({ error: 'API key and hashtag are required.' });
      return 
    }
  
    try {
        const response = await axios.get(`${'https://api.hikerapi.com'}/v2/fbsearch/topsearch`, {
            params: { query, next_max_id:page_token },
            headers: {
              'x-access-key': `${API_KEYS.INSTAGRAM_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });
      
      if (!response.data) {
      res.status(404).json({ error: 'Search not found.' });
        return 
      }
    //   const result = extractFullUserData(response.data)
      // Send the hashtag data as the response
    //   const result = extractMediaUserPairs(response.data)
    const result = extractFacebookSearchResults(response.data)
      res.status(200).json({ data:count?result.slice(0, count):result});
    } catch (error) {
        console.log(error)
      // Handle errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status other than 2xx
          res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
          // Request was made but no response received
          res.status(500).json({ error: 'No response received from the API.' });
        } else {
          // Something happened in setting up the request
          res.status(500).json({ error: 'Error setting up the request.' });
        }
      } else {
        // Non-Axios error
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    }
  }