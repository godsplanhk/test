import { Router } from "express";
import { crunchbaseOrganizationDetails } from "../../controllers/job/crunchbase/search";

const CrunchbaseRouter = Router()


CrunchbaseRouter.post("/search", crunchbaseOrganizationDetails)

export default CrunchbaseRouter