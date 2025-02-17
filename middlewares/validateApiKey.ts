import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const validateApifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return next()
    } catch (error) {
        res.status(500).json({"error":"Invalid Api Key"})
        return
    }
};
