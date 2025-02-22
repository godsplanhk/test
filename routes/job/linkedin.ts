import { Router } from "express";
import { search_linkedin_jobs } from "../../controllers/job/linkedin/searchJobs";
import { searchLinkedInLocations } from "../../controllers/job/linkedin/locationId";
import { getHiringTeam } from "../../controllers/job/linkedin/hiringTeam";
import { getPostedJobs } from "../../controllers/job/linkedin/profileJobs";
import { getLinkedInEmail } from "../../controllers/job/linkedin/email";
import { getJobDetails } from "../../controllers/job/linkedin/jobDetails";
import { searchEmployees } from "../../controllers/job/linkedin/employees";
import { getCompanyDetails } from "../../controllers/job/linkedin/companyDetails";
import { linkedinSalesNavigator } from "../../controllers/job/linkedin/salesNavigator";
import { salesNavigatorPeople } from "../../controllers/job/linkedin/salesNavigator/peopleLeads";
import { salesNavigatorCompany } from "../../controllers/job/linkedin/salesNavigator/companyLeads";
import { getCompanyByDomain } from "../../controllers/job/linkedin/companyDomain";

const LinkedinRouter = Router()


LinkedinRouter.post("/search", search_linkedin_jobs)
LinkedinRouter.post("/locationId", searchLinkedInLocations)
LinkedinRouter.post("/hiringTeam", getHiringTeam)
LinkedinRouter.post("/postedJobs", getPostedJobs)
LinkedinRouter.post("/email", getLinkedInEmail)
LinkedinRouter.post("/job", getJobDetails)
LinkedinRouter.post("/company", getCompanyDetails)
LinkedinRouter.post("/company-domain", getCompanyByDomain)
LinkedinRouter.post("/salesNavigator/people", salesNavigatorPeople)
LinkedinRouter.post("/salesNavigator/company", salesNavigatorCompany)


export default LinkedinRouter