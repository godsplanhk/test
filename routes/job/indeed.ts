import { Router } from "express";
import { searchIndeedJobs } from "../../controllers/job/indeed/search";
import { getIndeedJobDetails } from "../../controllers/job/indeed/details";

const IndeedRouter = Router()

IndeedRouter.post("/search", searchIndeedJobs)
IndeedRouter.post("/details", getIndeedJobDetails)



export default IndeedRouter