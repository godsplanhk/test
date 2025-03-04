import { Router, Request, Response } from "express";
import { Pool } from "pg";

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
});

const DatabaseRouter = Router();

DatabaseRouter.post("/log/social-media", async (req: Request, res: Response) => {
    const { task_title, task_description, status, time_left, memory_used, metadata } = req.body;

    // Validate required fields
    if (!task_title || !status) {
        res.status(400).json({ message: "task_title and status are required fields." });
        return 
    }

    // Define the SQL INSERT query
    const query = `
        INSERT INTO social_media_logs (
            task_title,
            task_description,
            status,
            time_left,
            memory_used,
            metadata
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    // Parameters for the query
    const values = [task_title, task_description || null, status, time_left || null, memory_used || null, metadata || null];

    try {
        // Execute the query
        const result = await pool.query(query, values);

        // Return the inserted task
        res.status(201).json({ message: "Task added successfully", task: result.rows[0] });
    } catch (error: any) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Error adding task", error: error.message });
    }
});

export default DatabaseRouter;
