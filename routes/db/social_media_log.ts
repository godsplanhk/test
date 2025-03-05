import { Router, Request, Response } from "express";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const DatabaseRouter = Router();

DatabaseRouter.post("/social-media/logs", async (req: Request, res: Response) => {
    const { user_id, title, subtitle, date, status, time_left, scraper_type, results, hidden } = req.body;

    // Validate required fields
    if (!user_id || !title || !date || !scraper_type) {
        res.status(400).json({ message: "user_id, title, date and scraper_type are required fields." });
        return 
    }

    // Validate UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user_id)) {
        res.status(400).json({ message: "Invalid user_id format. Must be a valid UUID." });
        return 
    }


    // Generate a unique task ID
    const task_id = uuidv4();

    // Define the SQL INSERT query
    const query = `
        INSERT INTO social_media_logs (
            id,
            user_id,
            title,
            subtitle,
            date,
            status,
            time_left,
            scraper_type,
            results,
            hidden
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;

    // Convert `results` to JSONB if provided
    let resultsJson = null;
    if (results) {
        try {
            resultsJson = JSON.stringify(results);
        } catch (error) {
            res.status(400).json({ message: "Invalid results format. Must be a valid JSON object/array." });
            return
        }
    }

    // Parameters for the query
    const values = [
        task_id,
        user_id,
        title,
        subtitle || null,
        date,
        status || null,
        time_left || null,
        scraper_type,
        resultsJson,
        hidden ?? false
    ];

    try {
        // Execute the query
        const result = await pool.query(query, values);

        // Return the inserted task
        res.status(201).json({success:true, message: "Scraping task added successfully", task: result.rows[0] });
    } catch (error: any) {
        console.error("Error adding scraping task:", error);
        res.status(500).json({ message: "Error adding scraping task", error: error.message });
    }
});

DatabaseRouter.get("/social-media/logs/:user_id", async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if (!user_id) {
        res.status(400).json({ message: "user_id is required" });
        return
    }

    try {
        // Query the database to fetch tasks for the given user_id
        const query = "SELECT * FROM social_media_logs WHERE user_id = $1";
        const result = await pool.query(query, [user_id]);

        // If no tasks found, return a message
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No scraping tasks found for this user." });
            return 
        }
        const tasksWithoutResults = result.rows.map(({ results, ...task }) => task);

        // Return the fetched tasks
        res.status(200).json({ tasks: tasksWithoutResults });
    } catch (error: any) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
});

DatabaseRouter.get("/social-media/logs/:user_id/:task_id/results", async (req: Request, res: Response) => {
    const { user_id, task_id } = req.params;

    if (!user_id || !task_id) {
        res.status(400).json({ message: "Both user_id and task_id are required." });
        return;
    }

    try {
        // Query the database to fetch only results for the given user_id and task_id
        const query = "SELECT results FROM social_media_logs WHERE user_id = $1 AND id = $2";
        const result = await pool.query(query, [user_id, task_id]);

        // If no matching task is found, return a message
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No results found for this user and task." });
            return;
        }

        // Extract and return only the results field
        res.status(200).json({ results: result.rows[0].results });
    } catch (error: any) {
        console.error("Error fetching task results:", error);
        res.status(500).json({ message: "Error fetching task results", error: error.message });
    }
});



export default DatabaseRouter;
