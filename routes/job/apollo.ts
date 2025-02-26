import { Router } from "express";
import { searchApolloPeople } from "../../controllers/job/apollo/peopleLeads";
import { searchApolloOrganizations } from "../../controllers/job/apollo/companyLeads";

const ApolloRouter = Router()

ApolloRouter.post("/people", searchApolloPeople)
ApolloRouter.post("/company", searchApolloOrganizations)



export default ApolloRouter