import axios from 'axios';
import { Request, Response } from 'express';

const API_BASE_URL = 'https://api.hikerapi.com';

export async function ig_hashtag_scraper(req: Request, res: Response) {
  const { hashtag, limit } = req.body;
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey || !hashtag) {
    res.status(400).json({ error: 'API key and hashtag are required.' });
    return 
  }

  try {
    // Fetch hashtag details
    const response = await axios.get(`${API_BASE_URL}/v1/hashtag/medias/top`, {
      params: { name: hashtag, amount: limit },
      headers: {
        'x-access-key': `${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data)

    // Check if the hashtag was found
    if (!response.data) {
    res.status(404).json({ error: 'Hashtag not found.' });
      return 
    }

    // Send the hashtag data as the response
    res.status(200).json({ data: response.data });
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

export async function ig_id_generator(req: Request, res: Response) {
    const { url } = req.body;
    const apiKey = req.headers['x-api-key'] as string;
  
    if (!apiKey || !url) {
      res.status(400).json({ error: 'API key and hashtag are required.' });
      return 
    }
  
    const type = url.includes("/reel/") || url.includes("/p/") ? "post" : "profile"
  
    try {
      let response = null;
      if(type == "post"){
          response = await axios.get(`${API_BASE_URL}/v2/media/info/by/url`, {
            params: { url },
            headers: {
              'x-access-key': `${apiKey}`,
              'Content-Type': 'application/json',
            },
          });
      }else{
          response = await axios.get(`${API_BASE_URL}/v1/user/by/url`, {
              params: { url },
              headers: {
                'x-access-key': `${apiKey}`,
                'Content-Type': 'application/json',
              },
          });
      }
      if (!response.data) {
      res.status(404).json({ error: 'Hashtag not found.' });
        return 
      }
  
      // Send the hashtag data as the response
      if(type == "post"){
      res.status(200).json({ id: response.data.media_or_ad.id });
      }
      else{
          res.status(200).json({id:response.data.pk.toString()})
      }
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
  