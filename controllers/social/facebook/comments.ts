import axios from 'axios';
import { Request, Response } from "express";

export const facebook_comment_scraper = async (req: Request, res: Response) => {
    const { post, limit } = req.body;
    const apiKey = req.headers["x-api-key"] as string;

    if (!post) {
        res.status(400).json({ "error": "Please provide the post_id" });
        return;
    }
    const params = post.includes("facebook.com") ? {post_url:post} : {post_id:post}
    const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/post/comments',
        params: params,
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        }
    };

    const regex = /(?:facebook\.com\/(?:people\/)?)([a-zA-Z0-9.-]+)/;

    try {
        const response = await axios.request(options);
        const comments = response.data.results.map((comment:any)=>{
            return {
                ...comment.author,
                username:comment.author.url?.match(regex)[1] ?? ""
            }
        });

        
        res.status(200).json({ comments:comments.slice(0,limit?limit:2), cursor:response.data.cursor });
    } catch (error:any) {
        console.log(error);
        res.status(error?.status)
    }
};
