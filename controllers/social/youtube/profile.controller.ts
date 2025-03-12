import axios from 'axios';
import { Request, Response } from "express";
import { google } from 'googleapis';

export const yt_channel_details = async (req: Request, res: Response) => {
    const { url:channel } = req.body;
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!channel) {
        res.status(400).json({ error: "Please provide a channel ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://youtube138.p.rapidapi.com/channel/details/',
        params: {
            id: channel.includes("youtube.com")?channel:`https://www.youtube.com/@${channel}`,
        },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data});
        return 
    } catch (error: any) {
        console.error("Error fetching YouTube channel details:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return 
    }
};


const youtube = google.youtube({
    version: 'v3',
    auth: "AIzaSyDLHyuP26m6dE_ZOnaBkCMVTcNVZx0G8HM",
});

export const yt_subscriptions = async (req: Request, res: Response) => {
    const channelId = req.body.channelId;
    
    if (!channelId) {
        res.status(400).json({ error: 'Channel ID is required' });
        return;
    }

    try {
        const response = await youtube.subscriptions.list({
            part: ['subscriberSnippet'],
            channelId: channelId,
            
        });
        res.status(200).json({data: response.data.items});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const yt_email_finder = async (req: Request, res: Response) => {
    const { channel_id } = req.body;
    const apiKey = req.headers["x-api-key"] as string; // Using API key from request headers

    if (!channel_id) {
        res.status(400).json({ error: "Please provide a channel ID" });
        return 
    }

    const options = {
        method: 'GET',
        url: `https://youtube-email-finder.p.rapidapi.com/youtube/channel_id/${channel_id}`,
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'youtube-email-finder.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.data.email[0]});
    } catch (error: any) {
        console.error("Error fetching YouTube email:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
    }
};