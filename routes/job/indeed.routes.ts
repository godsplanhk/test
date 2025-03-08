import { Router } from "express";
import { searchIndeedJobs, getIndeedJobDetails } from "../../controllers/job/indeed/indeed.controller";

const IndeedRouter = Router()

IndeedRouter.post("/search", searchIndeedJobs)
IndeedRouter.post("/details", getIndeedJobDetails)

export default IndeedRouter