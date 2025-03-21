import axios from 'axios';
import { Request, Response } from 'express';
import { API_KEYS } from '../../utils/apiKeys';


/**
 * Controller function for fetching jobs
 *
 * Request Body:
 * {
 *   searchTerm: string (The keyword to search for jobs, e.g., 'web')
 *   location: string (The location to search jobs in, e.g., 'new york')
 *   resultsWanted: number (The number of job results desired, e.g., 5)
 *   distance: number (The search radius in miles, e.g., 50)
 *   jobType: string (Type of job: 'fulltime', 'parttime', 'internship', 'contract')
 *   isRemote: boolean (Whether to search for remote jobs or not, e.g., false)
 *   hoursOld: number (How old the job postings can be, e.g., 10000)
 *   platform: string[] (The platform to search jobs on, e.g., 'indeed', 'linkedin', 'glassdoor',       'zip_recruiter')
 * }
 *
 * Response:
 *  Returns a JSON response containing job listings or an error message.
 */
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  const { searchTerm, location, resultsWanted, distance, jobType, isRemote, hoursOld, platform } = req.body;

  const options = {
    method: 'POST',
    url: 'https://jobs-search-api.p.rapidapi.com/getjobs',
    headers: {
      'x-rapidapi-key': API_KEYS.JOB_SEARCH_API_KEY,
      'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      search_term: searchTerm || 'web',
      location: location || 'new york',
      results_wanted: resultsWanted || 5,
      site_name: platform || ['glassdoor'],
      distance: distance || 50,
      job_type: jobType || 'fulltime',
      is_remote: isRemote || false,
      linkedin_fetch_description: false,
      hours_old: hoursOld || 10000
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error:any) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
};
