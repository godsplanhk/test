import { Router } from "express";
import { glassdoorLocationId, searchGlassdoorJobs, getGlassdoorJobDetails } from "../../controllers/job/glassdoor/glassdoor.controller";
const GlassdoorRouer = Router()

GlassdoorRouer.post("/locationId", glassdoorLocationId)
GlassdoorRouer.post("/search", searchGlassdoorJobs)
GlassdoorRouer.post("/details", getGlassdoorJobDetails)

export default GlassdoorRouer