import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const getOrCreateUser = async (req: Request, res: Response) => {
    const { id: user_id } = req.params;
  
    try {
      // Has the user ever had credits?
      const result = await pool.query(
        'SELECT SUM(credits) as credits FROM user_credits WHERE user_id = $1',
        [user_id]
      );
  
      let credits = parseInt(result.rows[0].credits || 0);
  
      if (!result.rows[0].credits) {
        // No record: give 50 credits (task_id must be passed from frontend)
        const { task_id } = req.body;
  
        if (!task_id) {
           res.status(400).json({ error: 'Initial task_id required for new user' });
           return
        }
  
        const insert = await pool.query(
          'INSERT INTO user_credits (user_id, task_id, credits) VALUES ($1, $2, $3) RETURNING *',
          [user_id, task_id, 50]
        );
  
        credits = 50;
         res.status(201).json({ user_id, credits, granted: insert.rows[0] });
         return
      }
  
      res.json({ user_id, credits });
    } catch (error) {
      res.status(500).json({ error: 'Server Error', details: error });
    }
  };
  

export const updateCredits = async (req: Request, res: Response) => {
  const { user_id, task_id, deduction } = req.body;

  if (!user_id || !task_id || !deduction) {
     res.status(400).json({ error: 'Missing user_id, task_id, or deduction' });
     return
  }

  try {
    const result = await pool.query(
      'SELECT SUM(credits) as credits FROM user_credits WHERE user_id = $1',
      [user_id]
    );

    const total = parseInt(result.rows[0].credits || 0);

    if (total < deduction) {
       res.status(400).json({ error: 'Not enough credits' });
       return
    }

    const insert = await pool.query(
      'INSERT INTO user_credits (user_id, task_id, credits) VALUES ($1, $2, $3) RETURNING *',
      [user_id, task_id, -deduction]
    );

    res.json({ success: true, updated: insert.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error });
  }
};

export const getCredits = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT SUM(credits) as credits FROM user_credits WHERE user_id = $1',
      [user_id]
    );

    res.json({ user_id, credits: parseInt(result.rows[0].credits || 0) });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error });
  }
};

export const checkCredits = async (req: Request, res: Response) => {
  const { user_id, requiredCredits } = req.body;

  if (!user_id || requiredCredits === undefined) {
     res.status(400).json({ error: 'Missing user_id or requiredCredits' });
     return
  }

  try {
    const result = await pool.query(
      'SELECT SUM(credits) as credits FROM user_credits WHERE user_id = $1',
      [user_id]
    );

    const total = parseInt(result.rows[0].credits || 0);

    res.json({
      sufficient: total >= requiredCredits,
      available: total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error });
  }
};
