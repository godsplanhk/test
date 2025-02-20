import { Router } from "express";
import { getPlaceDetails } from "../controllers/google maps/places/place";
import { searchPlaces } from "../controllers/google maps/places/search";
import { getPlaceDetailedInformation } from "../controllers/google maps/places/details";
import { getDirections } from "../controllers/google maps/directions";

const MapsRouter = Router()

MapsRouter.post("/place/details", getPlaceDetails)
MapsRouter.post("/place/search", searchPlaces)
MapsRouter.post("/place/detailedInformation", getPlaceDetailedInformation)
MapsRouter.post("/directions", getDirections)

export default MapsRouter