import axios from 'axios';
import { Request, Response } from 'express';

export const facebook_post_scraper = async (req:Request, res:Response) => {
    const postId = req.body.post_id;
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!postId || !apiKey) {
        res.status(400).json({ error: 'post_id query parameter is required' });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/post',
        params: { post_id: postId },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.results});
    } catch (error:any) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
