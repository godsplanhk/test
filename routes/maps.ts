import { Router } from "express";
import { getPlaceDetails } from "../controllers/maps/place";
import { searchPlaces } from "../controllers/maps/search";
import { getPlaceDetailedInformation } from "../controllers/maps/details";

const MapsRouter = Router()

MapsRouter.post("/place/details", getPlaceDetails)
MapsRouter.post("/place/search", searchPlaces)
MapsRouter.post("/place/detailedInformation", getPlaceDetailedInformation)

export default MapsRouter