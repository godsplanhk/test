import { Router } from "express";
import { searchApolloPeople } from "../../controllers/job/apollo/peopleLeads";
import { searchApolloComapnies } from "../../controllers/job/apollo/companyLeads";

const ApolloRouter = Router()

ApolloRouter.post("/people", searchApolloPeople)
ApolloRouter.post("/company", searchApolloComapnies)



export default ApolloRouter