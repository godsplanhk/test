import { Request, Response } from "express";
import axios from "axios";

async function helper(challenge_name:string){
    const options = {
        method: 'GET',
        url: 'https://tiktok-api23.p.rapidapi.com/api/challenge/info',
        params: {
          challengeName: challenge_name
        },
        headers: {
          'x-rapidapi-key': '82c226baedmshc18a75705610913p14b784jsn100ef5455726',
          'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          return response.data.challengeInfo.challenge.id
      } catch (error) {
          console.error(error);
          return undefined
      }
}


export const tiktok_hashtag_scraper = async (req: Request, res: Response) => {
    const { hashtag, count = '30', cursor = '0' } = req.body; // Get parameters from request body
    const apiKey = req.headers["x-api-key"] as string; // API key from request headers

    if (!hashtag) {
        res.status(400).json({ error: "Please provide a TikTok challengeId" });
        return;
    }

    const id = await helper(hashtag)
    console.log(id)
    if(!id){
        res.status(404).json({ error: "Hashtag not found" });
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://tiktok-api23.p.rapidapi.com/api/challenge/posts',
        params: { challengeId:id, count, cursor },
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json({data:response.data.itemList});
        return;
    } catch (error: any) {
        console.error("Error fetching TikTok challenge posts:", error);
        res.status(error?.response?.status || 500).json({ error: error.message });
        return;
    }
};
