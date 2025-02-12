import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const validateApifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers["x-apify-api-key"] as string;

        if (!apiKey) {
            res.status(401).json({"error":"Please provide an API Key"})
            return
        }

        const response = await axios.get("https://api.apify.com/v2/users/me", {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        if(response.status == 200){
            return next(); 
        }
        else{
            throw "Invalid"
        }
    } catch (error) {
        res.status(500).json({"error":"Invalid Api Key"})
        return
    }
};
