import { Router } from "express";
import { getPersonDetails, searchApolloPeople, searchPeopleUrl } from "../../controllers/job/apollo/people.controller";
import { getOrganizationDetails, searchApolloOrganizations, searchOrganizationsUrl } from "../../controllers/job/apollo/company.controller";

const ApolloRouter = Router()

ApolloRouter.post("/search-people", searchApolloPeople)
ApolloRouter.post("/search-people-url", searchPeopleUrl)

ApolloRouter.post("/search-company", searchApolloOrganizations)
ApolloRouter.post("/search-company-url", searchOrganizationsUrl)

ApolloRouter.get("/person-details", getPersonDetails)
ApolloRouter.get("/company-details", getOrganizationDetails)

export default ApolloRouter