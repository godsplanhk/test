import { Router } from "express";
import { getJobs } from "../../controllers/job/jobSearch.controller";

const JobSearchRouter = Router()


JobSearchRouter.post("/", getJobs)


export default JobSearchRouter