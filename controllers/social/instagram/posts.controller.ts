import axios from 'axios';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { API_KEYS } from '../../../utils/apiKeys';

const API_BASE_URL = 'https://api.hikerapi.com';

export async function ig_posts_scraper(req: Request, res: Response) {
  const { user_id, page_id } = req.body;
  

  if (!API_KEYS.INSTAGRAM_API_KEY || !user_id) {
    res.status(400).json({ error: 'API key and user id are required.' });
    return 
  }

  try {
    // Fetch hashtag details
    const response = await axios.get(`${API_BASE_URL}/v2/user/medias`, {
      params: { user_id, ...(page_id && {page_id}) },
      headers: {
        'x-access-key': `${API_KEYS.INSTAGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });


    // Check if the hashtag was found
    if (!response.data) {
    res.status(404).json({ error: 'Hashtag not found.' });
      return 
    }

    const data = response.data.response.items.map((item:any) => {
      try {
        const hashtags = item.caption.text.match(/#\w+/g).map((tag:string) => tag.substring(1));
        return {
          hashtags,
          ...item
        }
      }
      catch (error) {
        return item;
      }
    })
    // Send the hashtag data as the response
    res.status(200).json({ data });
  } catch (error) {
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

export async function ig_post_scraper(req: Request, res: Response) {
    const { url } = req.body;
    
  
    if (!API_KEYS.INSTAGRAM_API_KEY || !url) {
      res.status(400).json({ error: 'API key and hashtag are required.' });
      return 
    }
  
    try {
      // Fetch hashtag details
      const response = await axios.get(`${API_BASE_URL}/v2/media/info/by/url`, {
        params: { url },
        headers: {
          'x-access-key': `${API_KEYS.INSTAGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the hashtag was found
      if (!response.data) {
      res.status(404).json({ error: 'Hashtag not found.' });
        return 
      }
      const raw_data = response.data.media_or_ad
          
      // Send the hashtag data as the response
      try{
      let hashtags = []
      if(raw_data.caption.text){
      hashtags = raw_data.caption.text.match(/#\w+/g).map((tag:string) => tag.substring(1));
      }
      res.status(200).json({ data: {hashtags,...raw_data, text:raw_data.caption.text && raw_data.caption.text.replace(/#\S+/g, "")} });
    }
    catch{
      res.status(200).json({data:raw_data})
      return
    }
    } catch (error:any) {
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

  export async function ig_likes_scraper(req: Request, res: Response) {
    const { id, limit } = req.body;
    
  
    if (!API_KEYS.INSTAGRAM_API_KEY || !id) {
      res.status(400).json({ error: 'API key and hashtag are required.' });
      return 
    }
  
    try {
      // Fetch hashtag details
      const response = await axios.get(`${API_BASE_URL}/v2/media/likers`, {
        params: { id },
        headers: {
          'x-access-key': `${API_KEYS.INSTAGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
  
      // Check if the hashtag was found
      if (!response.data.users) {
      res.status(404).json({ error: 'Hashtag not found.' });
        return 
      }
  
      // Send the hashtag data as the response
      res.status(200).json({ data: response.data.users.slice(0, limit || 5 ) });
    } catch (error) {
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
  
  
  export async function ig_comment_scraper(req: Request, res: Response) {
    const { id, page_id, limit } = req.body;
    
  
    if (!API_KEYS.INSTAGRAM_API_KEY || !id) {
      res.status(400).json({ error: 'API key and hashtag are required.' });
      return;
    }
  
    try {
      // Fetch hashtag details
      const response = await axios.get(`${API_BASE_URL}/v2/media/comments`, {
        params: { id, page_id },
        headers: {
          'x-access-key': `${API_KEYS.INSTAGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Check if response data exists
      if (!response.data.response) {
        res.status(404).json({ error: 'Hashtag not found.' });
        return;
      }
  
      // Extract and process comments
      let comments = response.data.response.comments.slice(0, limit || 20);
  
      // Transform comments by renaming and formatting `created_at`
      comments = comments.map((comment: any) => {
        if (comment.created_at_utc) {
          return {
            ...comment,
            commented_on: dayjs(comment.created_at_utc).format('DD-MM-YYYY'),
          };
        }
        return comment;
      });
  
      // Send the formatted response
      res.status(200).json({ data: comments });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
          res.status(500).json({ error: 'No response received from the API.' });
        } else {
          res.status(500).json({ error: 'Error setting up the request.' });
        }
      } else {
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    }
  }
  