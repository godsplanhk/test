import { Router } from "express";
import { getPossibleHiringManager } from "../controllers/enrichement/icebreaker/employees";
import { generateIcebreaker } from "../controllers/enrichement/icebreaker/icebreaker";

const EnrichementRouter = Router()

EnrichementRouter.post("/icebreaker/hiring-team", getPossibleHiringManager)
EnrichementRouter.post("/icebreaker/generate", generateIcebreaker)


export default EnrichementRouter