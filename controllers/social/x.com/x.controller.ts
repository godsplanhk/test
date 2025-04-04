import axios from 'axios';
import { Request, Response } from "express";
import { API_KEYS } from '../../../utils/apiKeys';
import { extractUserListDataX } from '../../../utils/helpers';

export const x_users_by_id = async (req: Request, res: Response) => {
    const { userIds } = req.body; // Get Twitter user IDs from request body
     // API key from request headers

    if (!userIds) {
        res.status(400).json({ error: "Please provide an array of Twitter user IDs" });
        return;
    }

    if (!API_KEYS.TWITTER_API_KEY) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/get-users',
        params: { users: userIds },
        headers: {
            'x-rapidapi-key': API_KEYS.TWITTER_API_KEY,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        const formatted = response.data.result.data.users.map((i:any)=>i.result)
        res.status(200).json({data:formatted});
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter users info:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};

export const x_hashtags = async (req: Request, res: Response) => {
    const { query, count } = req.body;
    

    if (!query) {
        res.status(400).json({ error: "Please provide a search query" });
        return;
    }

    if (!API_KEYS.TWITTER_API_KEY) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/search-community',
        params: {
            query,
            count: count || '20'
        },
        headers: {
            'x-rapidapi-key': API_KEYS.TWITTER_API_KEY,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.result.communities_search_slice.items});
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter community search results:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};

export const x_account_search = async (req: Request, res: Response) => {
    const { query, count='10', cursor } = req.body;
    

    if (!query) {
        res.status(400).json({ error: "Please provide a search query" });
        return;
    }

    if (!API_KEYS.TWITTER_API_KEY) {
        res.status(400).json({ error: "Please provide an API key" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/search-v2',
        params: {
          type: 'Top',
          count,
          query,
          cursor:cursor
        },
        headers: {
          'x-rapidapi-key': API_KEYS.TWITTER_API_KEY,
          'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
      };

    try {
        const response = await axios.request(options);
        console.log(response.data)
        res.status(200).json({data:response.data.users_list, cursor:response.data.cursor});
        return;
    } catch (error: any) {
        console.error("Error fetching Twitter community search results:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};


