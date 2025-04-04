import { Router, Request, Response } from "express";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const EnrichmentLogsRouter = Router();

EnrichmentLogsRouter.post("/enrichment-logs", async (req: Request, res: Response) => {
    const { user_id, task_id, data } = req.body;

    if (!user_id || !data) {
        res.status(400).json({ message: "user_id and data are required." });
        return
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user_id)) {
        res.status(400).json({ message: "Invalid user_id format." });
         return
    }

    const taskId = task_id || uuidv4();

    try {
        if (task_id) {
            const existing = await pool.query(
                "SELECT * FROM enrichment WHERE task_id = $1 AND user_id = $2",
                [task_id, user_id]
            );

            if (existing.rows.length > 0) {
                const updated = await pool.query(
                    `UPDATE enrichment SET data = $1, updated_at = NOW() WHERE task_id = $2 AND user_id = $3 RETURNING *`,
                    [data, task_id, user_id]
                );
                 res.status(200).json({ message: "Task updated successfully", task: updated.rows[0] });
                 return
            }
        }

        const inserted = await pool.query(
            `INSERT INTO enrichment (task_id, user_id, data) VALUES ($1, $2, $3) RETURNING *`,
            [taskId, user_id, data]
        );
         res.status(201).json({ message: "Task created successfully", task: inserted.rows[0] });
         return

    } catch (error: any) {
        console.error("Error writing task:", error);
        res.status(500).json({ message: "Error writing task", error: error.message });
        return 
    }
});

EnrichmentLogsRouter.get("/enrichment-logs/:user_id", async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if (!user_id) {
        res.status(400).json({ message: "user_id is required" });
        return
    }

    try {
        const result = await pool.query(
            "SELECT task_id, user_id, data, created_at, updated_at FROM enrichment WHERE user_id = $1",
            [user_id]
        );

        if (result.rows.length === 0) {
             res.status(404).json({ message: "No tasks found for this user." });
             return
        }

        res.status(200).json({ tasks: result.rows });
    } catch (error: any) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
});

EnrichmentLogsRouter.get("/enrichment-logs/:user_id/:task_id", async (req: Request, res: Response) => {
    const { user_id, task_id } = req.params;

    if (!user_id || !task_id) {
         res.status(400).json({ message: "Both user_id and task_id are required." });
         return
    }

    try {
        const result = await pool.query(
            "SELECT data FROM enrichment WHERE user_id = $1 AND task_id = $2",
            [user_id, task_id]
        );

        if (result.rows.length === 0) {
             res.status(404).json({ message: "No task found for this user and task_id." });
             return
        }

        res.status(200).json({ data: result.rows[0].data });
    } catch (error: any) {
        console.error("Error fetching task data:", error);
        res.status(500).json({ message: "Error fetching task data", error: error.message });
    }
});

export default EnrichmentLogsRouter;
