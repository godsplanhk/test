import axios from 'axios';
import { Request, Response } from 'express';

const API_BASE_URL = 'https://api.hikerapi.com';

export async function ig_comment_scraper(req: Request, res: Response) {
  const { id, page_id, limit } = req.body;
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey || !id) {
    res.status(400).json({ error: 'API key and hashtag are required.' });
    return 
  }

  try {
    // Fetch hashtag details
    const response = await axios.get(`${API_BASE_URL}/v2/media/comments`, {
      params: { id, page_id },
      headers: {
        'x-access-key': `${apiKey}`,
        'Content-Type': 'application/json',
      },
    });


    // Check if the hashtag was found
    if (!response.data.response) {
    res.status(404).json({ error: 'Hashtag not found.' });
      return 
    }

    // Send the hashtag data as the response
    res.status(200).json({ data: response.data.response.comments.slice(0,limit||20) });
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
