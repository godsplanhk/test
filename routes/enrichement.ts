import { Router } from "express";
import { getPossibleHiringManager } from "../controllers/enrichement/icebreaker/employees";
import { generateIcebreaker } from "../controllers/enrichement/icebreaker/icebreaker";
import { getEnrichedInformation } from "../controllers/enrichement/icebreaker/enrichInformation";

const EnrichementRouter = Router()

EnrichementRouter.post("/icebreaker/hiring-team", getPossibleHiringManager)
EnrichementRouter.post("/icebreaker/generate", generateIcebreaker)
EnrichementRouter.post("/icebreaker/enrich", getEnrichedInformation)

export default EnrichementRouter