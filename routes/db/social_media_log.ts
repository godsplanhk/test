import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DatabaseRouter = Router();

DatabaseRouter.post("/log/social-media", async (req: Request, res: Response) => {
    try {
        const newTask = await prisma.social_media_logs.create({
            data: req.body
        });

        res.status(201).json({ message: "Task added successfully", task: newTask });
    } catch (error: any) {
        res.status(500).json({ message: "Error adding task", error: error.message });
    }
});

export default DatabaseRouter;
