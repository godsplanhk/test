import { google } from 'googleapis';
import { Request, Response } from 'express';

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
        res.status(200).json(response.data.items);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

