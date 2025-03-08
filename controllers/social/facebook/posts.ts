import axios from 'axios';
import { Request, Response } from 'express';

export const facebook_posts_scraper = async (req:Request, res:Response) => {
    const {profile_id, cursor, start_date, end_date} = req.body;
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!profile_id || !apiKey) {
        res.status(400).json({ error: 'post_id query parameter is required' });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/profile/posts',
        params: { profile_id, 
            ...(cursor && {cursor}),
            ...(start_date && {start_date}),
            ...(end_date && {end_date}),
        },
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
