import { Router } from "express";
import { crunchbaseOrganizationDetails } from "../../controllers/job/crunchbase/crunchbase.controller";

const CrunchbaseRouter = Router()


CrunchbaseRouter.post("/company-details", crunchbaseOrganizationDetails)


export default CrunchbaseRouter