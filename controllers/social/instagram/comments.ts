import axios from 'axios';
import { Request, Response } from 'express';
import dayjs from 'dayjs'; // Install via: npm install dayjs

const API_BASE_URL = 'https://api.hikerapi.com';

export async function ig_comment_scraper(req: Request, res: Response) {
  const { id, page_id, limit } = req.body;
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey || !id) {
    res.status(400).json({ error: 'API key and hashtag are required.' });
    return;
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
