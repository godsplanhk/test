import { Router } from "express";
import { search_linkedin_jobs } from "../../controllers/job/linkedin/searchJobs";
import { searchLinkedInLocations } from "../../controllers/job/linkedin/locationId";
import { getHiringTeam } from "../../controllers/job/linkedin/hiringTeam";
import { getPostedJobs } from "../../controllers/job/linkedin/profileJobs";
import { getLinkedInEmail } from "../../controllers/job/linkedin/email";
import { getJobDetails } from "../../controllers/job/linkedin/jobDetails";
import { getCompanyDetails } from "../../controllers/job/linkedin/companyDetails";
import { searchPeopleSalesNavigator } from "../../controllers/job/linkedin/sales-nav/people.controller";
import { getCompanyByDomain } from "../../controllers/job/linkedin/companyDomain";
import { getLinkedInProfile } from "../../controllers/job/linkedin/profile";
import { getCompanyFilterReference, searchCompaniesComprehensive, searchCompaniesSalesNavigator } from "../../controllers/job/linkedin/sales-nav/company.controller";
import { getIndustrySuggestions } from "../../controllers/job/linkedin/sales-nav/filters.controller";

const LinkedinRouter = Router()


LinkedinRouter.post("/search", search_linkedin_jobs)
LinkedinRouter.post("/locationId", searchLinkedInLocations)
LinkedinRouter.post("/hiringTeam", getHiringTeam)
LinkedinRouter.post("/postedJobs", getPostedJobs)
LinkedinRouter.post("/email", getLinkedInEmail)
LinkedinRouter.post("/job", getJobDetails)
LinkedinRouter.post("/company", getCompanyDetails)
LinkedinRouter.post("/company-domain", getCompanyByDomain)
LinkedinRouter.post("/profile", getLinkedInProfile)

LinkedinRouter.post("/sales-navigator/people-url", searchPeopleSalesNavigator)
LinkedinRouter.post("/sales-navigator/company-url", searchCompaniesSalesNavigator)
LinkedinRouter.post("/sales-navigator/company", searchCompaniesComprehensive)

export default LinkedinRouter