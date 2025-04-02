import { Router } from "express";
import { ASK_AI } from "../controllers/other/prompt.controller";
const OtherRouter = Router()

OtherRouter.post("/ask", ASK_AI)

export default OtherRouter