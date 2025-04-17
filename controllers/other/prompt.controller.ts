import { Request, Response } from "express";
import { askAI } from "../../utils/responses.ai";

export async function ASK_AI(req:Request, res:Response){
    try{
        const {prompt,scenario} = req.body
        
        if(!prompt || !process.env.PERPLEXITY_API_KEY){
            res.status(400).json({error:"Prompt is required"})
            return
        }

        const response = await askAI(prompt, scenario, process.env.PERPLEXITY_API_KEY)

        res.status(200).json({
            data:{...response,scenario}
        })
    }
    catch{
        res.status(500).json({error:"An unexpected error occured"})
    }
}