import { Router, Request, Response } from "express";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const DatabaseRouter = Router();

DatabaseRouter.post("/social-media/logs", async (req: Request, res: Response) => {
    const { user_id, title, task_id, subtitle, date, status, time_left, scraper_type, results, hidden } = req.body;

    // Validate required fields
    if (!user_id || !title || !date || !scraper_type) {
        res.status(400).json({ message: "user_id, title, date, and scraper_type are required fields." });
        return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user_id)) {
        res.status(400).json({ message: "Invalid user_id format. Must be a valid UUID." });
        return;
    }

    // Convert `results` to JSONB if provided
    let resultsJson = null;
    if (results) {
        try {
            resultsJson = JSON.stringify(results);
        } catch (error) {
            res.status(400).json({ message: "Invalid results format. Must be a valid JSON object/array." });
            return;
        }
    }

    // Generate a new task_id if not provided
    const newTaskId = task_id || uuidv4();

    try {
        if (task_id) {
            // Check if the record with same user_id and task_id exists
            const checkQuery = `
                SELECT * FROM social_media_logs WHERE user_id = $1 AND id = $2;
            `;
            const checkResult = await pool.query(checkQuery, [user_id, task_id]);

            if (checkResult.rows.length > 0) {
                // Update the existing record
                const updateQuery = `
                    UPDATE social_media_logs
                    SET title = $1, subtitle = $2, date = $3, status = $4, time_left = $5, 
                        scraper_type = $6, results = $7, hidden = $8
                    WHERE user_id = $9 AND id = $10
                    RETURNING *;
                `;
                const updateValues = [
                    title,
                    subtitle || null,
                    date,
                    status || null,
                    time_left || null,
                    scraper_type,
                    resultsJson,
                    hidden ?? false,
                    user_id,
                    task_id
                ];
                const updateResult = await pool.query(updateQuery, updateValues);
                res.status(200).json({ success: true, message: "Scraping task updated successfully", task: updateResult.rows[0] });
                return 
            }
        }

        // Insert a new record if no matching task_id is found
        const insertQuery = `
            INSERT INTO social_media_logs (
                id, user_id, title, subtitle, date, status, time_left, scraper_type, results, hidden
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const insertValues = [
            newTaskId,
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
        const insertResult = await pool.query(insertQuery, insertValues);

        res.status(201).json({ success: true, message: "Scraping task added successfully", task: insertResult.rows[0] });

    } catch (error: any) {
        console.error("Error adding/updating scraping task:", error);
        res.status(500).json({ message: "Error processing scraping task", error: error.message });
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
