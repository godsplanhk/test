import { Router } from "express";

import { searchPeopleSalesNavigator, searchCompaniesSalesNavigator } from "../../controllers/job/linkedin/sales-nav/url.controller";
import { jobs_posted_by_profile, linkedin_job_details, search_linkedin_jobs } from "../../controllers/job/linkedin/jobs.controller";
import { getHiringTeam, getCompanyDetails, getCompanyByDomain } from "../../controllers/job/linkedin/company.controller";
import {  getLinkedInEmail, getLinkedInProfile } from "../../controllers/job/linkedin/linkedin.controller";

const LinkedinRouter = Router()


LinkedinRouter.post("/search", search_linkedin_jobs)
LinkedinRouter.post("/hiringTeam", getHiringTeam)
LinkedinRouter.post("/postedJobs", jobs_posted_by_profile)
LinkedinRouter.post("/email", getLinkedInEmail)
LinkedinRouter.post("/job", linkedin_job_details)
LinkedinRouter.post("/company", getCompanyDetails)
LinkedinRouter.post("/company-domain", getCompanyByDomain)
LinkedinRouter.post("/profile", getLinkedInProfile)

LinkedinRouter.post("/sales-navigator/people-url", searchPeopleSalesNavigator)
LinkedinRouter.post("/sales-navigator/company-url", searchCompaniesSalesNavigator)

export default LinkedinRouter