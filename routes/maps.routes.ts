import { Router } from "express";
import { getPlaceDetails, searchPlaces, getPlaceDetailedInformation } from "../controllers/maps/maps.controller";
const MapsRouter = Router()

MapsRouter.post("/place/details", getPlaceDetails)
MapsRouter.post("/place/search", searchPlaces)
MapsRouter.post("/place/detailedInformation", getPlaceDetailedInformation)

export default MapsRouter