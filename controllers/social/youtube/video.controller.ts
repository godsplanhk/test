import axios from 'axios';
import { Request, Response } from "express";
import { convertSecondsToHHMMSS, convertTimestampToDate } from '../../../utils/helpers';

export const yt_video_scraper = async (req: Request, res: Response) => {
    const { video } = req.body; // Get video ID from request
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!video) {
        res.status(400).json({ error: "Please provide a video ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/video/details/',
        params: {
            id: video,
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:{...response.data, length:convertSecondsToHHMMSS(response.data.lengthSeconds)}});
        return 
    } catch (error: any) {
        console.error("Error fetching video details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};


export const yt_videos_scraper = async (req: Request, res: Response) => {
    const { channel, filter, cursor } = req.body; // Get video ID from request
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!channel) {
        res.status(400).json({ error: "Please provide a video ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/channel/videos/',
        params: {
            id: channel,
            ...(filter && {filter}),
            ...(cursor && {cursor})
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
    };

    
    try {
        const response = await axios.request(options);
        const formatted_data = response.data.contents.map((i:any)=>{
            return {...i, length:convertSecondsToHHMMSS(i[i.type].lengthSeconds)}
        })
        res.status(200).json({data:formatted_data, cursor:response.data.cursorNext || ""});
        return 
    } catch (error: any) {
        console.error("Error fetching video details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};

export const yt_comments_scraper = async (req: Request, res: Response) => {
    const { video, limit, cursor } = req.body;
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!video) {
        res.status(400).json({ error: "Please provide a video ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/video/comments/',
        params: {
            id: video,
            ...(cursor && {cursor})
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data?.comments.slice(0, limit || 2), cursor:response?.data.cursorNext});
        return 
    } catch (error: any) {
        console.error("Error fetching YouTube video comments:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};
