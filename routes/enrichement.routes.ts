import { Router } from "express";
import { getPossibleHiringManager, generateIcebreaker, getEnrichedInformation, getJobHiringTeam } from "../controllers/enrichement/enrichement.controller";

const EnrichementRouter = Router()

EnrichementRouter.post("/icebreaker/hiring-team", getPossibleHiringManager)
EnrichementRouter.post("/icebreaker/job-hiring-team", getJobHiringTeam)
EnrichementRouter.post("/icebreaker/generate", generateIcebreaker)
EnrichementRouter.post("/icebreaker/enrich", getEnrichedInformation)

export default EnrichementRouter