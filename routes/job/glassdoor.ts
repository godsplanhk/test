import { Router } from "express";
import { glassdoorLocationId } from "../../controllers/job/glassdoor/locationId";
import { searchGlassdoorJobs } from "../../controllers/job/glassdoor/search";
import { getGlassdoorJobDetails } from "../../controllers/job/glassdoor/details";

const GlassdoorRouer = Router()

GlassdoorRouer.post("/locationId", glassdoorLocationId)
GlassdoorRouer.post("/search", searchGlassdoorJobs)
GlassdoorRouer.post("/details", getGlassdoorJobDetails)

export default GlassdoorRouer